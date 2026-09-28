// Default WhatsApp invitation template. Placeholders (simplified mustache):
//   {{calling}} → Bapak/Ibu/Saudara/Saudari/custom
//   {{name}}    → guest name
//   {{link}}    → invitation URL (?to=code)
// Editable by the admin at /admin/invitations (stored in the settings table).
export const DEFAULT_WA_TEMPLATE =
  "Assalamu'alaikum Wr. Wb.\n\n" +
  'Yth. {{calling}} {{name}},\n\n' +
  'Kami mengundang Anda untuk hadir dalam acara pernikahan kami.\n\n' +
  'Buka undangan: {{link}}\n\n' +
  'Terima kasih 🙏\n' +
  'Vicky & Nafiu';