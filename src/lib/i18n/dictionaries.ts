export const dictionaries = {
  id: {
    home: {
      title: 'Undangan Pernikahan',
      scroll: 'Gulir untuk menjelajahi'
    },
    sections: {
      'bride-groom': 'Pengantin',
      'quran-quotes': 'Kutipan Al-Quran',
      events: 'Acara',
      maps: 'Peta',
      rsvp: 'RSVP',
      messages: 'Pesan',
      credits: 'Kredit'
    },
    brideGroom: {
      brideParent: 'Putri dari Bapak {0} & Ibu {1}',
      groomParent: 'Putra dari Bapak {0} & Ibu {1}',
      storyTitle: 'Kisah Kami',
      storyBody:
        'Kami bertemu pada tahun 2020 dan langsung terhubung karena kecintaan kami pada game retro. Setelah 6 tahun yang indah, kami sangat bersemangat untuk melangkah ke jenjang pernikahan!'
    },
    quran: {
      translation:
        'Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.',
      reference: '— QS. Ar-Rum: 21'
    },
    events: {
      countdown: 'Hitung mundur menuju hari bahagia!',
      dates: {
        '10 Oktober 2026': '10 Oktober 2026'
      }
    },
    maps: {
      intro: 'Kami menantikan kedatangan Anda di Gedung Serba Guna Perum Serdang Asri.',
      open: 'Buka di Google Maps'
    },
    rsvp: {
      intro: 'Mohon konfirmasi kehadiran Anda dengan mengisi formulir di bawah ini.',
      inviteCode: 'Kode Undangan',
      invitePlaceholder: 'cth. VIP123',
      name: 'Nama Anda',
      namePlaceholder: 'Nama',
      attend: 'Apakah Anda akan hadir?',
      yes: 'Ya',
      no: 'Tidak',
      headcount: 'Jumlah Tamu',
      submit: 'Kirim RSVP',
      submitting: 'Mengirim...',
      thankYou: 'Terima kasih!',
      saved: 'RSVP Anda telah disimpan.',
      errorFallback: 'Terjadi kesalahan.'
    },
    messages: {
      empty: 'Belum ada pesan. Jadilah yang pertama memberikan ucapan!',
      namePlaceholder: 'Nama Anda',
      messagePlaceholder: 'Tinggalkan ucapan untuk pengantin...',
      send: 'Kirim Pesan',
      sending: 'Mengirim...'
    },
    credits: {
      thankYou: 'Terima Kasih',
      support: 'Untuk semua yang telah mendukung kami mewujudkan mimpi ini.',
      roles: {
        concept: 'Konsep & Ide',
        development: 'Pengembangan',
        assets: 'Aset'
      },
      poweredBy: 'Didukung Oleh'
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
      'bride-groom': 'Bride & Groom',
      'quran-quotes': 'Quran Quotes',
      events: 'Events',
      maps: 'Maps',
      rsvp: 'RSVP',
      messages: 'Messages',
      credits: 'Credits'
    },
    brideGroom: {
      brideParent: 'Daughter of Mr. {0} & Mrs. {1}',
      groomParent: 'Son of Mr. {0} & Mrs. {1}',
      storyTitle: 'Our Story',
      storyBody:
        'We met in 2020 and instantly connected over our love for retro games. After 6 wonderful years, we are so excited to tie the knot!'
    },
    quran: {
      translation:
        '"And among His Signs is this, that He created for you mates from among yourselves, that ye may dwell in tranquility with them, and He has put love and mercy between your (hearts): verily in that are Signs for those who reflect."',
      reference: '— Surah Ar-Rum, 21'
    },
    events: {
      countdown: 'Countdown to the big day!',
      dates: {
        '10 Oktober 2026': '10 October 2026'
      }
    },
    maps: {
      intro: 'We look forward to seeing you at Gedung Serba Guna Perum Serdang Asri.',
      open: 'Open in Google Maps'
    },
    rsvp: {
      intro: 'Please confirm your attendance by filling out the form below.',
      inviteCode: 'Invitation Code',
      invitePlaceholder: 'e.g. VIP123',
      name: 'Your Name',
      namePlaceholder: 'John Doe',
      attend: 'Will you attend?',
      yes: 'Yes',
      no: 'No',
      headcount: 'Number of Guests',
      submit: 'Submit RSVP',
      submitting: 'Submitting...',
      thankYou: 'Thank you!',
      saved: 'Your RSVP has been saved.',
      errorFallback: 'Something went wrong.'
    },
    messages: {
      empty: 'No messages yet. Be the first to leave a wish!',
      namePlaceholder: 'Your Name',
      messagePlaceholder: 'Leave a wish for the bride and groom...',
      send: 'Send Message',
      sending: 'Sending...'
    },
    credits: {
      thankYou: 'Thank You',
      support: 'To everyone who supported us in making this dream a reality.',
      roles: {
        concept: 'Concept & Idea',
        development: 'Development',
        assets: 'Assets'
      },
      poweredBy: 'Powered By'
    },
    aria: {
      mute: 'Mute music and sounds',
      unmute: 'Unmute music and sounds',
      home: 'Back to home page',
      toEnglish: 'Switch to English',
      toIndonesian: 'Switch to Bahasa Indonesia'
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
  messages: { empty: string; namePlaceholder: string; messagePlaceholder: string; send: string; sending: string };
  credits: {
    thankYou: string;
    support: string;
    roles: Record<string, string>;
    poweredBy: string;
  };
  aria: { mute: string; unmute: string; home: string; toEnglish: string; toIndonesian: string };
};

export const dicts: Record<'id' | 'en', Dictionary> = dictionaries;