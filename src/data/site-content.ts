export type Language = "id" | "en";

export const languageLabels: Record<Language, string> = {
  id: "ID",
  en: "EN",
};

const socialLinks = [
  {
    label: "WhatsApp",
    value: "+62 831 5096 4050",
    href: "https://wa.me/6283150964050",
  },
  {
    label: "Email",
    value: "faddgraphics@gmail.com",
    href: "mailto:faddgraphics@gmail.com",
  },
  {
    label: "Instagram",
    value: "@fadd_graphics",
    href: "https://instagram.com/fadd_graphics",
  },
  {
    label: "LinkedIn",
    value: "Mufaddhol",
    href: "https://www.linkedin.com/in/mufaddhol-01b60333a/",
  },
];

export const siteCopy = {
  id: {
    meta: {
      title: "FADD GRAPHICS - Freelance Graphic Designer",
    },
    app: {
      skipLink: "Lewati ke konten utama",
      loading: "Memuat",
      backToTop: "Kembali ke atas",
    },
    navItems: [
      { label: "Beranda", kind: "section", target: "hero" },
      { label: "Profile", kind: "section", target: "profile" },
      { label: "Portfolio", kind: "page", target: "/portfolio" },
      { label: "Services", kind: "section", target: "services" },
      { label: "About", kind: "section", target: "about" },
      { label: "Contact", kind: "section", target: "contact" },
    ],
    header: {
      tagline: "Freelance graphic designer",
      cta: "Mulai project",
      languageLabel: "Bahasa",
      openMenu: "Buka navigasi",
      closeMenu: "Tutup navigasi",
    },
    hero: {
      eyebrow: "Personal graphic design portfolio",
      title: "Desain visual yang rapi, jelas, dan terasa personal.",
      description:
        "FADD GRAPHICS adalah portfolio dan layanan freelance graphic design oleh Mufaddhol. Saya membantu brand, organisasi, dan event menyiapkan visual yang mudah dipahami, enak dilihat, dan siap dipakai.",
      primaryCta: "Lihat karya pilihan",
      archiveCta: "Buka portfolio",
      briefCta: "Kirim brief",
      noteEyebrow: "Catatan pribadi",
      note:
        "Saya percaya desain yang baik tidak perlu terlalu ramai. Yang penting pesan terbaca, komposisi terjaga, dan hasil akhirnya sesuai kebutuhan.",
      teaserEyebrow: "Portfolio teaser",
      teaserTitle: "Pilihan karya",
      teaserBadge: "Home",
      teaserOther: "Karya lain",
      teaserFallback: "Karya lain bisa dilihat di halaman portfolio lengkap.",
      archiveEyebrow: "Lihat semua portfolio",
      archiveDescription:
        "Buka halaman portfolio untuk melihat arsip karya dengan susunan gambar yang lebih fokus.",
      archiveButton: "Lihat semua portfolio",
      stats: [
        { value: "100+", label: "karya dalam arsip visual" },
        { value: "6", label: "kategori layanan desain" },
        { value: "5 tahap", label: "alur kerja dari brief sampai final" },
      ],
    },
    profileIntro: {
      eyebrow: "Profile overview",
      title: "FADD GRAPHICS adalah portfolio personal dan layanan freelance design.",
      description:
        "Di balik FADD GRAPHICS ada satu desainer: Mufaddhol. Pendekatannya sederhana, komunikatif, dan berangkat dari kebutuhan nyata klien atau organisasi.",
      cards: [
        {
          eyebrow: "Brand intro",
          text:
            "Cocok untuk kebutuhan logo, poster, social media content, event publication, dan visual promosi yang butuh arah jelas.",
        },
        {
          eyebrow: "Pendekatan",
          text:
            "Saya mulai dari brief, lalu menyusun visual yang masuk akal untuk audiens, media, dan tujuan project.",
        },
        {
          eyebrow: "Hasil yang dicari",
          text:
            "Desain terlihat rapi, informasi terbaca, dan file akhir siap digunakan untuk digital atau cetak.",
        },
      ],
    },
    portfolio: {
      featuredEyebrow: "Featured works",
      featuredTitle: "Beberapa karya yang mewakili cara saya mengolah visual.",
      featuredDescription:
        "Bagian ini menampilkan karya pilihan secara ringkas. Untuk arsip lengkap, buka halaman portfolio.",
      fallbackDeliverable: "Portfolio",
      galleryEyebrow: "Portfolio gallery",
      galleryTitle: "Preview singkat untuk melihat variasi karya.",
      galleryDescription:
        "Gunakan filter kategori untuk melihat jenis pekerjaan yang paling relevan. Semua gambar tetap dibuat ringkas agar nyaman dibuka.",
      categorySummaryPrefix: "Menampilkan",
      categorySummaryMiddle: "karya untuk kategori",
      fullPortfolioCta: "Buka portfolio penuh",
      archiveEyebrow: "Archive preview",
      archiveTitle: "Arsip lengkap tersedia di halaman portfolio.",
      archiveDescription:
        "Halaman portfolio dibuat untuk browsing visual yang lebih tenang, tanpa terlalu banyak teks di bawah gambar.",
      archiveCta: "Lihat seluruh koleksi",
      cardFallback: "Arsip visual",
      categories: {
        all: "Semua",
        logo: "Logo",
        identity: "Identitas",
        campaign: "Kampanye",
        editorial: "Editorial",
        event: "Event",
        promotion: "Promosi",
        announcement: "Pengumuman",
      },
      page: {
        eyebrow: "Full portfolio archive",
        title: "Seluruh karya ditampilkan sebagai galeri visual.",
        description:
          "Halaman ini dibuat untuk melihat karya secara cepat dan rapi. Klik item satu gambar untuk preview, atau buka detail jika karya memiliki gallery tambahan.",
        backHome: "Kembali ke beranda",
        startProject: "Mulai project baru",
        fallbackNotice: "Data Supabase belum tersedia. Menampilkan arsip lokal sementara.",
      },
      detail: {
        fallbackDescription: "Showcase karya dengan gambar utama dan preview pendukung.",
        back: "Kembali ke Portfolio",
        category: "Kategori",
        focus: "Fokus",
        tone: "Tone",
      },
      modal: {
        close: "Tutup detail karya",
        fallbackLabel: "Arsip visual",
        focus: "Fokus",
        tone: "Tone",
        tags: "Tags",
        discuss: "Diskusikan project serupa",
        preview: "preview",
      },
    },
    services: {
      eyebrow: "Services",
      title: "Layanan desain untuk kebutuhan brand, event, dan publikasi.",
      description:
        "Fokus layanan dibuat dari pekerjaan yang sering saya tangani sebagai freelance graphic designer.",
      items: [
        {
          key: "identity",
          title: "Logo & identitas visual",
          description:
            "Logo, basic identity, dan elemen visual utama agar brand lebih mudah dikenali.",
        },
        {
          key: "campaign",
          title: "Poster & campaign material",
          description:
            "Visual promosi, edukasi, dan publikasi dengan pesan yang jelas dan komposisi yang terbaca.",
        },
        {
          key: "social",
          title: "Social media content",
          description:
            "Feed, carousel, dan aset konten yang konsisten dengan kebutuhan brand atau kegiatan.",
        },
        {
          key: "print",
          title: "Banner & print material",
          description:
            "Materi cetak untuk event, organisasi, dan promosi yang tetap rapi saat diproduksi.",
        },
        {
          key: "merch",
          title: "Apparel & merchandise",
          description:
            "Desain kaos, souvenir, atau turunan visual lain yang tetap sejalan dengan identitas utama.",
        },
        {
          key: "custom",
          title: "Custom design request",
          description:
            "Kebutuhan desain khusus yang tidak masuk kategori umum, tetapi tetap perlu dikerjakan terarah.",
        },
      ],
    },
    process: {
      eyebrow: "Process",
      title: "Alur kerja dibuat sederhana agar project tidak melebar ke mana-mana.",
      description:
        "Setiap tahap menjaga arah visual tetap jelas, dari diskusi awal sampai file final dikirim.",
      steps: [
        {
          key: "consultation",
          title: "Diskusi awal",
          description:
            "Membahas kebutuhan, konteks, audiens, deadline, dan output yang dibutuhkan.",
        },
        {
          key: "brief",
          title: "Brief dirapikan",
          description:
            "Menyusun referensi, prioritas informasi, format file, dan batasan visual secara jelas.",
        },
        {
          key: "concept",
          title: "Eksplorasi desain",
          description:
            "Mengolah komposisi, tipografi, warna, dan aset visual sesuai arah brief.",
        },
        {
          key: "revision",
          title: "Revisi terarah",
          description:
            "Menyesuaikan desain berdasarkan feedback yang spesifik, bukan mengulang tanpa arah.",
        },
        {
          key: "delivery",
          title: "Final delivery",
          description:
            "Mengirim file akhir sesuai kebutuhan digital, presentasi, atau produksi cetak.",
        },
      ],
    },
    reasons: {
      eyebrow: "Why work with me",
      title: "Yang saya jaga adalah rasa visual, komunikasi, dan ketepatan output.",
      description:
        "Saya tidak menjanjikan hal berlebihan. Saya fokus pada desain yang bisa dipakai, mudah dipahami, dan dikerjakan dengan proses yang jelas.",
      items: [
        {
          key: "taste",
          title: "Visual lebih terkendali",
          description:
            "Desain tidak dibuat ramai hanya supaya terlihat mencolok. Hierarki dan keterbacaan tetap jadi prioritas.",
        },
        {
          key: "communication",
          title: "Komunikasi langsung",
          description:
            "Diskusi berjalan langsung dengan desainer, sehingga brief, revisi, dan keputusan visual lebih mudah dilacak.",
        },
        {
          key: "flexibility",
          title: "Fleksibel untuk banyak kebutuhan",
          description:
            "Cocok untuk brand lokal, organisasi, event, konten promosi, dan kebutuhan publikasi harian.",
        },
        {
          key: "structure",
          title: "File dan proses lebih rapi",
          description:
            "Output disiapkan dengan struktur yang mudah dipakai kembali, bukan hanya terlihat selesai di layar.",
        },
      ],
    },
    about: {
      eyebrow: "About / Founder",
      title: "Mufaddhol, freelance graphic designer di balik FADD GRAPHICS.",
      description:
        "FADD GRAPHICS saya gunakan sebagai ruang portfolio pribadi sekaligus identitas layanan desain visual.",
      portraitAlt: "Mufaddhol, founder FADD GRAPHICS",
      body: [
        "Saya mengerjakan desain grafis untuk logo, poster, social media content, publikasi event, dan kebutuhan visual organisasi. Cara kerja saya dimulai dari brief yang jelas, lalu diterjemahkan menjadi visual yang rapi dan bisa digunakan.",
        "Latar belakang multimedia, organisasi, dan studi Informatika membuat saya terbiasa bekerja sistematis: memahami konteks, menyusun prioritas informasi, lalu menjaga konsistensi visual sampai file akhir dikirim.",
      ],
      highlights: [
        "Fokus pada logo, poster, branding support, dan materi publikasi.",
        "Berpengalaman dalam freelance design, video editing, organisasi, dan dokumentasi event.",
        "Menggabungkan sensitivitas visual dengan alur kerja yang terstruktur.",
        "Terbuka untuk project brand, komunitas, event, edukasi, dan promosi.",
      ],
      experienceEyebrow: "Experience",
      educationEyebrow: "Education",
      skillsEyebrow: "Skills",
      skillNote: "Level skill ditulis apa adanya agar ekspektasi tetap realistis.",
      experiences: [
        {
          role: "Freelance Graphic Designer",
          period: "2024 - present",
          description:
            "Mengerjakan logo, poster, dan social media content untuk kebutuhan branding serta promosi. Bekerja dari brief, menangani revisi terstruktur, dan menjaga konsistensi visual.",
        },
        {
          role: "Freelance Video Editor",
          period: "2024 - present",
          description:
            "Mengedit konten video untuk social media dan dokumentasi event dengan perhatian pada alur visual, timing, dan kebutuhan audiens.",
        },
        {
          role: "Academic Content Assistance",
          period: "2024 - present",
          description:
            "Membantu pengembangan konten akademik dan materi belajar secara sistematis dengan perhatian pada ketelitian.",
        },
        {
          role: "Dewan Ambalan - Litev & IT Ambalan",
          period: "2023 - 2024",
          description:
            "Mendukung riset, evaluasi, kebutuhan IT, dan publikasi untuk kegiatan Ambalan.",
        },
        {
          role: "Multimedia Club - Journalism & Graphic Design Division",
          period: "2024 - 2025",
          description:
            "Menangani dokumentasi event dan membuat desain publikasi untuk kebutuhan internal maupun eksternal organisasi.",
        },
        {
          role: "IPNU IPPNU Dusun - Vice Chair & Organization IT",
          period: "2024 - present",
          description:
            "Mendukung koordinasi organisasi, social media, dan kebutuhan digital untuk komunikasi publikasi.",
        },
        {
          role: "Volunteer JOTA JOTI Nasional 2024 - Design Division",
          period: "2024",
          description:
            "Membuat materi visual untuk kebutuhan publikasi event tingkat nasional.",
        },
        {
          role: "Informatics Championship 2025 Unsoed - PDD Division",
          period: "2025",
          description:
            "Berkontribusi pada konten publikasi dan dokumentasi event kompetisi tingkat jurusan.",
        },
        {
          role: "Temu Angkatan Informatika 2025 - PDD Division",
          period: "2025",
          description:
            "Mendukung kebutuhan desain dan dokumentasi untuk event angkatan mahasiswa.",
        },
      ],
      education: [
        {
          title: "MAN 1 Wonosobo - Science Major",
          period: "2022 - 2025",
        },
        {
          title: "Universitas Jenderal Soedirman - Bachelor of Informatics",
          period: "2025 - present",
        },
      ],
      skills: [
        "Adobe Photoshop - developing",
        "Adobe Illustrator - intermediate, developing",
        "Affinity - intermediate",
        "Adobe Lightroom - intermediate",
        "Figma - developing",
        "CapCut - intermediate",
        "PixelLab - advanced",
      ],
    },
    trust: {
      eyebrow: "Trust",
      title: "Kepercayaan dibangun dari proses kerja yang bisa dijelaskan.",
      description:
        "Belum semua project memiliki testimoni publik. Untuk saat ini, bagian ini menjelaskan sinyal kerja yang bisa Anda nilai sebelum mengirim brief.",
      signals: [
        {
          title: "Konteks project beragam",
          description:
            "Arsip berisi logo, poster event, campaign, announcement, promosi layanan, dan kebutuhan organisasi.",
        },
        {
          title: "Revisi dibuat terarah",
          description:
            "Perubahan dibahas berdasarkan tujuan desain, bukan selera yang berubah tanpa acuan.",
        },
        {
          title: "Siap menampilkan testimoni nyata",
          description:
            "Jika ada izin publikasi dari klien, kutipan dan konteks project bisa ditambahkan secara transparan.",
        },
      ],
      testimonials: [
        {
          slot: "Kualitas visual",
          quote:
            "Ruang ini disiapkan untuk testimoni tentang ketepatan arah visual dan kualitas hasil akhir.",
        },
        {
          slot: "Komunikasi",
          quote:
            "Bagian ini akan memuat kutipan tentang proses diskusi, revisi, dan kenyamanan kerja sama.",
        },
        {
          slot: "Hasil project",
          quote:
            "Testimoni akan ditampilkan setelah ada izin publikasi dan konteks project yang jelas.",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Hal yang biasanya perlu jelas sebelum project dimulai.",
      description:
        "Jawaban singkat ini membantu menyamakan ekspektasi soal jenis pekerjaan, revisi, file akhir, dan cara memulai.",
      items: [
        {
          question: "Project seperti apa yang bisa dikerjakan FADD GRAPHICS?",
          answer:
            "Logo, identitas visual sederhana, poster, social media content, banner, campaign material, announcement card, dan desain publikasi untuk event atau organisasi.",
        },
        {
          question: "Apakah brief harus sudah lengkap?",
          answer:
            "Tidak harus. Brief awal boleh masih kasar, tetapi minimal perlu ada tujuan, media penggunaan, deadline, dan contoh referensi agar arah desain bisa dibaca.",
        },
        {
          question: "Bagaimana sistem revisinya?",
          answer:
            "Revisi dilakukan setelah konsep awal dikirim. Feedback sebaiknya spesifik, misalnya soal informasi, warna, komposisi, atau format, agar perubahan tetap efektif.",
        },
        {
          question: "Apakah file akhir bisa untuk digital dan cetak?",
          answer:
            "Bisa. Format akhir disesuaikan dengan kebutuhan, misalnya PNG/JPG untuk digital atau PDF siap cetak jika diperlukan.",
        },
        {
          question: "Berapa lama pengerjaan desain?",
          answer:
            "Tergantung jenis project, jumlah deliverable, dan antrean pekerjaan. Estimasi waktu dibahas setelah brief awal diterima.",
        },
        {
          question: "Bagaimana cara mulai?",
          answer:
            "Isi form contact atau hubungi WhatsApp. Tulis kebutuhan utama, deadline, referensi visual, dan output yang dibutuhkan.",
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Kalau kebutuhan desainnya sudah terlihat, kita bisa mulai dari brief singkat.",
      description:
        "Tulis kebutuhan utama di form ini. Setelah itu, Anda bisa lanjut diskusi lewat WhatsApp atau email dengan ringkasan yang lebih rapi.",
      links: socialLinks,
      form: {
        idle: "Isi detail singkat, lalu lanjutkan ke WhatsApp dengan brief yang sudah tersusun.",
        error: "Masih ada informasi yang perlu dilengkapi sebelum brief dikirim.",
        success:
          "Brief sudah disusun. Lanjutkan percakapan lewat WhatsApp atau gunakan email jika lebih nyaman.",
        fields: {
          name: "Nama",
          email: "Email",
          service: "Jenis project",
          timeline: "Timeline",
          message: "Ringkasan kebutuhan",
        },
        placeholders: {
          name: "Nama lengkap",
          email: "nama@email.com",
          service: "Pilih layanan",
          timeline: "Belum ditentukan",
          message:
            "Ceritakan tujuan project, jenis deliverable, gaya visual yang diinginkan, dan detail penting lain.",
        },
        errors: {
          name: "Nama perlu diisi.",
          emailRequired: "Email perlu diisi.",
          emailInvalid: "Gunakan format email yang valid.",
          service: "Pilih jenis project yang paling mendekati kebutuhan Anda.",
          messageRequired: "Ceritakan kebutuhan project secara singkat.",
          messageLength: "Agar brief lebih jelas, tulis setidaknya 24 karakter.",
        },
        timelineOptions: [
          { value: "Secepatnya", label: "Secepatnya" },
          { value: "1-2 minggu", label: "1-2 minggu" },
          { value: "2-4 minggu", label: "2-4 minggu" },
          { value: "Lebih dari 1 bulan", label: "Lebih dari 1 bulan" },
        ],
        whatsappIntro: "Halo FADD GRAPHICS, saya ingin mendiskusikan project baru.",
        whatsappLabels: {
          name: "Nama",
          email: "Email",
          service: "Jenis project",
          timeline: "Timeline",
          fallbackTimeline: "Belum ditentukan",
          summary: "Ringkasan kebutuhan:",
        },
        openWhatsapp: "Buka WhatsApp",
        sendEmail: "Kirim via email",
        submit: "Siapkan brief",
      },
    },
    footer: {
      description:
        "Personal design portfolio dan layanan freelance graphic design oleh Mufaddhol.",
      note:
        "Saya membantu menyiapkan logo, materi promosi, dan publikasi event dengan visual yang rapi, jelas, dan siap digunakan.",
      quickLinks: "Arah cepat",
      portfolio: "Buka portfolio",
      services: "Lihat services",
      brief: "Kirim brief",
      connect: "Connect",
      copyright:
        "FADD GRAPHICS by Mufaddhol. Personal portfolio, freelance work, and visual design service.",
    },
    maintenanceNotice: {
      eyebrow: "Maintenance notice",
      title: "Website ini masih dalam tahap penyempurnaan.",
      description:
        "Portfolio sedang ditinjau dan diperbarui bertahap. Beberapa detail karya bisa berubah selama proses review.",
      cta: "Lanjutkan ke website",
    },
  },
  en: {
    meta: {
      title: "FADD GRAPHICS - Freelance Graphic Designer",
    },
    app: {
      skipLink: "Skip to main content",
      loading: "Loading",
      backToTop: "Back to top",
    },
    navItems: [
      { label: "Home", kind: "section", target: "hero" },
      { label: "Profile", kind: "section", target: "profile" },
      { label: "Portfolio", kind: "page", target: "/portfolio" },
      { label: "Services", kind: "section", target: "services" },
      { label: "About", kind: "section", target: "about" },
      { label: "Contact", kind: "section", target: "contact" },
    ],
    header: {
      tagline: "Freelance graphic designer",
      cta: "Start a project",
      languageLabel: "Language",
      openMenu: "Open navigation",
      closeMenu: "Close navigation",
    },
    hero: {
      eyebrow: "Personal graphic design portfolio",
      title: "Clear, practical visual design with a personal touch.",
      description:
        "FADD GRAPHICS is the freelance graphic design portfolio and service of Mufaddhol. I help brands, organizations, and events prepare visuals that are easy to read, well structured, and ready to use.",
      primaryCta: "View selected work",
      archiveCta: "Open portfolio",
      briefCta: "Send a brief",
      noteEyebrow: "Personal note",
      note:
        "Good design does not have to be noisy. The message should be clear, the composition should hold together, and the final file should fit the need.",
      teaserEyebrow: "Portfolio teaser",
      teaserTitle: "Selected work",
      teaserBadge: "Home",
      teaserOther: "Another piece",
      teaserFallback: "More work is available in the full portfolio archive.",
      archiveEyebrow: "View full portfolio",
      archiveDescription:
        "Open the portfolio page to browse the full visual archive in a more focused layout.",
      archiveButton: "View full portfolio",
      stats: [
        { value: "41+", label: "works in the visual archive" },
        { value: "6", label: "design service categories" },
        { value: "5 steps", label: "workflow from brief to final files" },
      ],
    },
    profileIntro: {
      eyebrow: "Profile overview",
      title: "FADD GRAPHICS is a personal portfolio and freelance design service.",
      description:
        "Behind FADD GRAPHICS is one designer: Mufaddhol. The approach is simple, communicative, and based on real client or organizational needs.",
      cards: [
        {
          eyebrow: "Brand intro",
          text:
            "Relevant for logos, posters, social media content, event publication, and promotional visuals that need clear direction.",
        },
        {
          eyebrow: "Approach",
          text:
            "I start from the brief, then shape a visual direction that fits the audience, medium, and project goal.",
        },
        {
          eyebrow: "Expected result",
          text:
            "The design should look tidy, communicate clearly, and be ready for digital or print use.",
        },
      ],
    },
    portfolio: {
      featuredEyebrow: "Featured works",
      featuredTitle: "A few projects that show how I approach visual work.",
      featuredDescription:
        "This section keeps selected work short and direct. Open the portfolio page for the full archive.",
      fallbackDeliverable: "Portfolio",
      galleryEyebrow: "Portfolio gallery",
      galleryTitle: "A short preview of different design directions.",
      galleryDescription:
        "Use the category filters to browse the most relevant type of work. Images are kept compact for easier viewing.",
      categorySummaryPrefix: "Showing",
      categorySummaryMiddle: "works in",
      fullPortfolioCta: "Open full portfolio",
      archiveEyebrow: "Archive preview",
      archiveTitle: "The complete archive is available on the portfolio page.",
      archiveDescription:
        "The portfolio page is made for image-first browsing without too much text below each piece.",
      archiveCta: "View all work",
      cardFallback: "Visual archive",
      categories: {
        all: "All",
        logo: "Logo",
        identity: "Identity",
        campaign: "Campaign",
        editorial: "Editorial",
        event: "Event",
        promotion: "Promotion",
        announcement: "Announcement",
      },
      page: {
        eyebrow: "Full portfolio archive",
        title: "All work is presented as a visual gallery.",
        description:
          "This page is built for quick, clean browsing. Click a single-image item for preview, or open the detail page when an item has supporting gallery images.",
        backHome: "Back to home",
        startProject: "Start a new project",
        fallbackNotice: "Supabase data is not available yet. Showing the local archive instead.",
      },
      detail: {
        fallbackDescription: "A project showcase with a main image and supporting previews.",
        back: "Back to Portfolio",
        category: "Category",
        focus: "Focus",
        tone: "Tone",
      },
      modal: {
        close: "Close work detail",
        fallbackLabel: "Visual archive",
        focus: "Focus",
        tone: "Tone",
        tags: "Tags",
        discuss: "Discuss a similar project",
        preview: "preview",
      },
    },
    services: {
      eyebrow: "Services",
      title: "Design services for brands, events, and publication needs.",
      description:
        "These services come from the kind of work I often handle as a freelance graphic designer.",
      items: [
        {
          key: "identity",
          title: "Logo & visual identity",
          description:
            "Logos, basic identity systems, and core visuals that help a brand become easier to recognize.",
        },
        {
          key: "campaign",
          title: "Poster & campaign material",
          description:
            "Promotional, educational, and publication visuals with a clear message and readable composition.",
        },
        {
          key: "social",
          title: "Social media content",
          description:
            "Feed assets, carousels, and content visuals aligned with brand or event needs.",
        },
        {
          key: "print",
          title: "Banner & print material",
          description:
            "Printed materials for events, organizations, and promotions that stay tidy in production.",
        },
        {
          key: "merch",
          title: "Apparel & merchandise",
          description:
            "T-shirt, souvenir, and supporting visual designs that still relate to the main identity.",
        },
        {
          key: "custom",
          title: "Custom design request",
          description:
            "Specific design needs that do not fit a standard category but still need a clear process.",
        },
      ],
    },
    process: {
      eyebrow: "Process",
      title: "A simple workflow that keeps the project from drifting.",
      description:
        "Each step keeps the visual direction clear, from the first discussion to final file delivery.",
      steps: [
        {
          key: "consultation",
          title: "Initial discussion",
          description:
            "Reviewing the need, context, audience, deadline, and expected output.",
        },
        {
          key: "brief",
          title: "Brief cleanup",
          description:
            "Clarifying references, content priority, file formats, and visual boundaries.",
        },
        {
          key: "concept",
          title: "Design exploration",
          description:
            "Working through composition, typography, color, and visual assets based on the brief.",
        },
        {
          key: "revision",
          title: "Directed revisions",
          description:
            "Adjusting the design based on specific feedback instead of restarting without direction.",
        },
        {
          key: "delivery",
          title: "Final delivery",
          description:
            "Sending final files for digital use, presentation, or print production.",
        },
      ],
    },
    reasons: {
      eyebrow: "Why work with me",
      title: "I focus on visual judgment, clear communication, and usable output.",
      description:
        "I do not overpromise. I focus on design that can be used, understood, and delivered through a clear process.",
      items: [
        {
          key: "taste",
          title: "Controlled visual direction",
          description:
            "The design is not made busy just to attract attention. Hierarchy and readability stay central.",
        },
        {
          key: "communication",
          title: "Direct communication",
          description:
            "You discuss the brief, revisions, and visual decisions directly with the designer.",
        },
        {
          key: "flexibility",
          title: "Flexible for different needs",
          description:
            "Suitable for local brands, organizations, events, promotional content, and daily publication needs.",
        },
        {
          key: "structure",
          title: "Cleaner files and process",
          description:
            "Deliverables are prepared so they are easy to reuse, not only finished visually on screen.",
        },
      ],
    },
    about: {
      eyebrow: "About / Founder",
      title: "Mufaddhol, the freelance graphic designer behind FADD GRAPHICS.",
      description:
        "I use FADD GRAPHICS as my personal portfolio space and visual design service identity.",
      portraitAlt: "Mufaddhol, founder of FADD GRAPHICS",
      body: [
        "I work on graphic design projects such as logos, posters, social media content, event publication, and organizational visual needs. My process starts from a clear brief, then turns it into usable visual output.",
        "My background in multimedia, organizational work, and Informatics studies shapes a more systematic way of working: understanding context, organizing information, and maintaining visual consistency until final delivery.",
      ],
      highlights: [
        "Focused on logos, posters, branding support, and publication materials.",
        "Experienced in freelance design, video editing, organizational work, and event documentation.",
        "Combines visual sensitivity with a structured workflow.",
        "Open to projects for brands, communities, events, education, and promotion.",
      ],
      experienceEyebrow: "Experience",
      educationEyebrow: "Education",
      skillsEyebrow: "Skills",
      skillNote: "Skill levels are written plainly so expectations stay realistic.",
      experiences: [
        {
          role: "Freelance Graphic Designer",
          period: "2024 - present",
          description:
            "Creates logos, posters, and social media content for branding and promotional needs. Works from briefs, handles structured revisions, and maintains visual consistency.",
        },
        {
          role: "Freelance Video Editor",
          period: "2024 - present",
          description:
            "Edits social media and event documentation videos with attention to visual flow, timing, and audience fit.",
        },
        {
          role: "Academic Content Assistance",
          period: "2024 - present",
          description:
            "Assists with independent academic content development and learning material preparation with a systematic approach.",
        },
        {
          role: "Dewan Ambalan - Litev & IT Ambalan",
          period: "2023 - 2024",
          description:
            "Worked in research and evaluation while supporting IT and publication needs for Ambalan activities.",
        },
        {
          role: "Multimedia Club - Journalism & Graphic Design Division",
          period: "2024 - 2025",
          description:
            "Handled event documentation and produced publication designs for internal and external organizational needs.",
        },
        {
          role: "IPNU IPPNU Dusun - Vice Chair & Organization IT",
          period: "2024 - present",
          description:
            "Supports organizational coordination while managing social media and digital communication needs.",
        },
        {
          role: "Volunteer JOTA JOTI Nasional 2024 - Design Division",
          period: "2024",
          description:
            "Produced visual materials for national-level event publication needs.",
        },
        {
          role: "Informatics Championship 2025 Unsoed - PDD Division",
          period: "2025",
          description:
            "Contributed to publication content and event documentation for a department-level competition.",
        },
        {
          role: "Temu Angkatan Informatika 2025 - PDD Division",
          period: "2025",
          description:
            "Supported design and documentation needs for a student cohort event.",
        },
      ],
      education: [
        {
          title: "MAN 1 Wonosobo - Science Major",
          period: "2022 - 2025",
        },
        {
          title: "Universitas Jenderal Soedirman - Bachelor of Informatics",
          period: "2025 - present",
        },
      ],
      skills: [
        "Adobe Photoshop - developing",
        "Adobe Illustrator - intermediate, developing",
        "Affinity - intermediate",
        "Adobe Lightroom - intermediate",
        "Figma - developing",
        "CapCut - intermediate",
        "PixelLab - advanced",
      ],
    },
    trust: {
      eyebrow: "Trust",
      title: "Trust is built through work that can be explained.",
      description:
        "Not every project has a public testimonial yet. For now, this section explains the work signals you can review before sending a brief.",
      signals: [
        {
          title: "Different project contexts",
          description:
            "The archive includes logos, event posters, campaign visuals, announcement cards, service promotion, and organizational materials.",
        },
        {
          title: "Revisions stay directed",
          description:
            "Changes are discussed based on design goals, not shifting taste without a reference point.",
        },
        {
          title: "Ready for real testimonials",
          description:
            "When clients allow publication, quotes and project context can be added transparently.",
        },
      ],
      testimonials: [
        {
          slot: "Visual quality",
          quote:
            "This area is reserved for testimonials about visual direction and final output quality.",
        },
        {
          slot: "Communication",
          quote:
            "This card will hold feedback about discussion, revision, and the working experience.",
        },
        {
          slot: "Project result",
          quote:
            "Testimonials will be shown only after publication permission and clear project context are available.",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Things that should be clear before a project starts.",
      description:
        "Short answers to align expectations about project types, revisions, final files, and how to begin.",
      items: [
        {
          question: "What kind of projects can FADD GRAPHICS handle?",
          answer:
            "Logos, simple visual identity, posters, social media content, banners, campaign materials, announcement cards, and event or organizational publication design.",
        },
        {
          question: "Does the brief need to be complete?",
          answer:
            "Not necessarily. An early brief is fine, but it should include the goal, usage medium, deadline, and reference examples so the visual direction is easier to read.",
        },
        {
          question: "How do revisions work?",
          answer:
            "Revisions happen after the initial concept is sent. Feedback should be specific, such as information, color, composition, or format, so changes stay effective.",
        },
        {
          question: "Can final files be prepared for digital and print?",
          answer:
            "Yes. Final formats are adjusted to the need, such as PNG/JPG for digital use or print-ready PDF when required.",
        },
        {
          question: "How long does a design project take?",
          answer:
            "It depends on the project type, number of deliverables, and current queue. Timeline estimates are discussed after the first brief is received.",
        },
        {
          question: "How do I start?",
          answer:
            "Fill in the contact form or reach out through WhatsApp. Include the main need, deadline, visual references, and expected output.",
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "If the design need is clear enough, we can start with a short brief.",
      description:
        "Write the main need in this form. After that, you can continue through WhatsApp or email with a cleaner project summary.",
      links: socialLinks,
      form: {
        idle: "Fill in a short detail, then continue to WhatsApp with a prepared brief.",
        error: "Some information still needs to be completed before the brief can be sent.",
        success:
          "The brief is prepared. Continue through WhatsApp or use email if that is more comfortable.",
        fields: {
          name: "Name",
          email: "Email",
          service: "Project type",
          timeline: "Timeline",
          message: "Project summary",
        },
        placeholders: {
          name: "Full name",
          email: "name@email.com",
          service: "Choose a service",
          timeline: "Not decided yet",
          message:
            "Share the project goal, deliverables, preferred visual direction, and other important details.",
        },
        errors: {
          name: "Name is required.",
          emailRequired: "Email is required.",
          emailInvalid: "Use a valid email format.",
          service: "Choose the closest project type.",
          messageRequired: "Write a short project summary.",
          messageLength: "Write at least 24 characters so the brief is clear enough.",
        },
        timelineOptions: [
          { value: "As soon as possible", label: "As soon as possible" },
          { value: "1-2 weeks", label: "1-2 weeks" },
          { value: "2-4 weeks", label: "2-4 weeks" },
          { value: "More than 1 month", label: "More than 1 month" },
        ],
        whatsappIntro: "Hello FADD GRAPHICS, I would like to discuss a new project.",
        whatsappLabels: {
          name: "Name",
          email: "Email",
          service: "Project type",
          timeline: "Timeline",
          fallbackTimeline: "Not decided yet",
          summary: "Project summary:",
        },
        openWhatsapp: "Open WhatsApp",
        sendEmail: "Send by email",
        submit: "Prepare brief",
      },
    },
    footer: {
      description:
        "Personal design portfolio and freelance graphic design service by Mufaddhol.",
      note:
        "I help prepare logos, promotional materials, and event publications with clear, tidy, ready-to-use visuals.",
      quickLinks: "Quick links",
      portfolio: "Open portfolio",
      services: "View services",
      brief: "Send a brief",
      connect: "Connect",
      copyright:
        "FADD GRAPHICS by Mufaddhol. Personal portfolio, freelance work, and visual design service.",
    },
    maintenanceNotice: {
      eyebrow: "Maintenance notice",
      title: "This website is still being refined.",
      description:
        "The portfolio is being reviewed and updated gradually. Some project details may change during the review process.",
      cta: "Continue to website",
    },
  },
} as const;

export type SiteCopy = (typeof siteCopy)[Language];
