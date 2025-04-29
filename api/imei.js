export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // 🔥 CORS izni veriyoruz
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const imei = req.query.imei;
  if (!imei) {
    return res.status(400).json({ error: "IMEI parametresi eksik." });
  }

  const form = new URLSearchParams();
  form.append("service", "0");
  form.append("imei", imei);
  form.append("key", "I3P-WWZ-2U6-O7D-YCN-MLT-5QW-KZ4");

  try {
    const response = await fetch("https://api.ifreeicloud.co.uk", {
      method: "POST",
      body: form
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(500).json({ error: data.error || "API başarısız." });
    }

    return res.status(200).json({
      model: data.object?.model || "Yok",
      model_number: data.object?.model_number || "Yok",
      find_my_iphone: data.object?.find_my_iphone || "Bilinmiyor"
    });
  } catch (error) {
    return res.status(500).json({ error: "Sunucu hatası: " + error.message });
  }
}
