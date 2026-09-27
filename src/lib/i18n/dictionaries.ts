export const dictionaries = {
  id: {
    home: {
      title: 'Undangan Pernikahan',
      scroll: 'Gulir untuk menjelajah'
    },
    sections: {
      'bride-groom': 'Mempelai',
      'quran-quotes': 'Kutipan Al-Quran',
      events: 'Rangkaian Acara',
      maps: 'Lokasi',
      rsvp: 'Konfirmasi Kehadiran',
      messages: 'Ucapan',
      credits: 'Tentang Undangan'
    },
    brideGroom: {
      brideParent: 'Putri dari Bapak {0} & Ibu {1}',
      groomParent: 'Putra dari Bapak {0} & Ibu {1}',
      storyTitle: 'Kisah Kami',
      storyBody:
        'Kami bertemu pada tahun 2021 dan dipertemukan oleh kecintaan kami pada game retro. Setelah melewati enam tahun bersama, kami siap memulai perjalanan baru sebagai suami dan istri.'
    },
    quran: {
      translation:
        'Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.',
      reference: '— QS. Ar-Rum: 21'
    },
    events: {
      countdown: 'Menuju hari bahagia',
      dates: {
        '10 Oktober 2026': '10 Oktober 2026'
      }
    },
    maps: {
      intro: 'Kami dengan senang hati menantikan kehadiran Anda di Gedung Serba Guna Perum Serdang Asri.',
      open: 'Lihat Lokasi di Google Maps'
    },
    rsvp: {
      intro: 'Mohon konfirmasi kehadiran Anda melalui formulir di bawah ini.',
      inviteCode: 'Kode Undangan',
      invitePlaceholder: 'Contoh: VIP123',
      name: 'Nama',
      namePlaceholder: 'Masukkan nama Anda',
      attend: 'Apakah Anda berkenan hadir?',
      yes: 'Ya, saya hadir',
      no: 'Maaf, saya tidak dapat hadir',
      headcount: 'Jumlah Tamu',
      submit: 'Konfirmasi Kehadiran',
      submitting: 'Menyimpan...',
      thankYou: 'Terima kasih!',
      saved: 'Konfirmasi kehadiran Anda telah tersimpan.',
      errorFallback: 'Maaf, terjadi kesalahan. Silakan coba kembali.'
    },
    messages: {
      empty: 'Belum ada ucapan. Jadilah yang pertama meninggalkan ucapan untuk kami!',
      namePlaceholder: 'Nama Anda',
      messagePlaceholder: 'Tulis ucapan untuk kami...',
      send: 'Kirim Ucapan',
      sending: 'Mengirim...'
    },
    credits: {
      thankYou: 'Terima Kasih',
      support: 'Terima kasih kepada semua yang telah hadir, mendukung, dan menjadi bagian dari perjalanan kami.',
      roles: {
        concept: 'Konsep & Ide',
        development: 'Pengembangan',
        assets: 'Aset'
      },
      poweredBy: 'Dibuat dengan'
    },
    aria: {
      mute: 'Matikan musik dan suara',
      unmute: 'Nyalakan musik dan suara',
      home: 'Kembali ke halaman utama',
      toEnglish: 'Ganti ke Bahasa Inggris',
      toIndonesian: 'Ganti ke Bahasa Indonesia'
    }
  },

  en: {
    home: {
      title: 'Wedding Invitation',
      scroll: 'Scroll to explore'
    },
    sections: {
      'bride-groom': 'The Couple',
      'quran-quotes': 'Quran Quotes',
      events: 'The Celebration',
      maps: 'Location',
      rsvp: 'RSVP',
      messages: 'Wishes',
      credits: 'About This Invitation'
    },
    brideGroom: {
      brideParent: 'Daughter of Mr. {0} & Mrs. {1}',
      groomParent: 'Son of Mr. {0} & Mrs. {1}',
      storyTitle: 'Our Story',
      storyBody:
        'We met in 2021 and bonded over our shared love for retro games. After six wonderful years together, we are ready to begin a new chapter as husband and wife.'
    },
    quran: {
      translation:
        '"And among His Signs is this, that He created for you mates from among yourselves, that ye may dwell in tranquility with them, and He has put love and mercy between your (hearts): verily in that are Signs for those who reflect."',
      reference: '— Surah Ar-Rum, 21'
    },
    events: {
      countdown: 'Counting down to our special day',
      dates: {
        '10 Oktober 2026': '10 October 2026'
      }
    },
    maps: {
      intro: 'We would be delighted to have you join us at Gedung Serba Guna Perum Serdang Asri.',
      open: 'View on Google Maps'
    },
    rsvp: {
      intro: 'Please let us know if you will be joining us by filling out the form below.',
      inviteCode: 'Invitation Code',
      invitePlaceholder: 'e.g. VIP123',
      name: 'Name',
      namePlaceholder: 'Enter your name',
      attend: 'Will you be joining us?',
      yes: 'Yes, I’ll be there',
      no: 'Sorry, I won’t be able to attend',
      headcount: 'Number of Guests',
      submit: 'Confirm Attendance',
      submitting: 'Saving...',
      thankYou: 'Thank you!',
      saved: 'Your attendance has been confirmed.',
      errorFallback: 'Sorry, something went wrong. Please try again.'
    },
    messages: {
      empty: 'No wishes yet. Be the first to leave a message for us!',
      namePlaceholder: 'Your Name',
      messagePlaceholder: 'Write a wish for us...',
      send: 'Send Wish',
      sending: 'Sending...'
    },
    credits: {
      thankYou: 'Thank You',
      support: 'Thank you to everyone who has been there for us and shared in this journey.',
      roles: {
        concept: 'Concept & Ideas',
        development: 'Development',
        assets: 'Assets'
      },
      poweredBy: 'Made with'
    },
    aria: {
      mute: 'Mute music and sounds',
      unmute: 'Turn on music and sounds',
      home: 'Back to home',
      toEnglish: 'Switch to English',
      toIndonesian: 'Switch to Indonesian'
    }
  }
} as const;

export type Dictionary = {
  home: { title: string; scroll: string };
  sections: Record<string, string>;
  brideGroom: { brideParent: string; groomParent: string; storyTitle: string; storyBody: string };
  quran: { translation: string; reference: string };
  events: { countdown: string; dates: Record<string, string> };
  maps: { intro: string; open: string };
  rsvp: {
    intro: string;
    inviteCode: string;
    invitePlaceholder: string;
    name: string;
    namePlaceholder: string;
    attend: string;
    yes: string;
    no: string;
    headcount: string;
    submit: string;
    submitting: string;
    thankYou: string;
    saved: string;
    errorFallback: string;
  };
  messages: {
    empty: string;
    namePlaceholder: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
  };
  credits: {
    thankYou: string;
    support: string;
    roles: Record<string, string>;
    poweredBy: string;
  };
  aria: {
    mute: string;
    unmute: string;
    home: string;
    toEnglish: string;
    toIndonesian: string;
  };
};

export const dicts: Record<'id' | 'en', Dictionary> = dictionaries;