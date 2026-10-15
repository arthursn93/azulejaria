// Ajusta o projeto Android gerado pelo Capacitor:
// - coloca o App ID do AdMob no AndroidManifest.xml (obrigatório, senão o app fecha ao abrir)
// - trava a tela em modo retrato
// - avisa se o targetSdk estiver abaixo do exigido pela Play Store
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const raiz = new URL("..", import.meta.url).pathname;
const manifesto = join(raiz, "android/app/src/main/AndroidManifest.xml");
if (!existsSync(manifesto)) {
  console.error('Pasta android não encontrada. Rode primeiro: npm run android:criar');
  process.exit(1);
}
const { appId } = JSON.parse(readFileSync(join(raiz, "admob.config.json"), "utf8"));
let xml = readFileSync(manifesto, "utf8");

const meta = `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${appId}"/>`;
if (xml.includes("com.google.android.gms.ads.APPLICATION_ID")) {
  xml = xml.replace(/<meta-data\s+android:name="com\.google\.android\.gms\.ads\.APPLICATION_ID"[^>]*\/>/, meta);
} else {
  xml = xml.replace(/<application([^>]*)>/, `<application$1>\n        ${meta}`);
}

if (!xml.includes("android:screenOrientation")) {
  xml = xml.replace(/<activity(\s)/, `<activity android:screenOrientation="portrait"$1`);
}
writeFileSync(manifesto, xml);
console.log("AndroidManifest.xml configurado (AdMob App ID + retrato).");

const vars = join(raiz, "android/variables.gradle");
if (existsSync(vars)) {
  const m = readFileSync(vars, "utf8").match(/targetSdkVersion\s*=\s*(\d+)/);
  if (m && +m[1] < 36) {
    console.warn(`ATENÇÃO: targetSdkVersion = ${m[1]}. A Play Store exige 36 para apps novos desde 31/08/2026.`);
    console.warn("Edite android/variables.gradle e mude compileSdkVersion e targetSdkVersion para 36.");
  }
}
