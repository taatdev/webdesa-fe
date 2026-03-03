export async function sendComplaint(formData: {
  name: string;
  email: string;
  message: string;
}) {
  console.log("📨 Pengaduan masuk:", formData);
  // TODO: kirim ke email / database / API Telegram
  return { success: true };
}
