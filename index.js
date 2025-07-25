document.addEventListener('DOMContentLoaded', () => {

    // --- Seleksi Elemen DOM ---
    const moodButtons = document.querySelectorAll('.mood-btn');
    const historyList = document.getElementById('mood-history-list');

    // --- BARU: Seleksi Elemen Modal ---
    const suggestionModal = document.getElementById('suggestion-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalEmoji = document.getElementById('modal-emoji');
    const modalTitle = document.getElementById('modal-title');
    const modalSuggestion = document.getElementById('modal-suggestion');

    // --- Objek untuk memetakan nama mood ke emoji ---
    const moodEmojis = {
        'Luar Biasa': '😄', 'Baik': '😊', 'Biasa Saja': '😐', 'Buruk': '😟', 'Sangat Buruk': '😭'
    };

    // --- BARU: Database Saran untuk Setiap Mood ---
    const suggestions = {
        'Luar Biasa': [
            "Bagus! Bagikan energi positifmu kepada orang lain hari ini.",
            "Manfaatkan semangatmu untuk mengerjakan tugas yang menantang.",
            "Syukuri momen ini. Tulis tiga hal yang membuatmu bahagia.",
            "Gunakan energimu untuk membantu orang lain hari ini, sekecil apa pun itu.",
            "Tantang dirimu untuk mencoba hal baru yang selalu kamu tunda."
        ],
        'Baik': [
            "Terus pertahankan! Lakukan sesuatu yang baik untuk dirimu atau orang lain.",
            "Waktu yang tepat untuk memulai hobi baru atau melanjutkan yang tertunda.",
            "Nikmati harimu dengan mendengarkan musik yang ceria.",
            "Habiskan waktu di luar rumah, nikmati udara segar dan sinar matahari.",
            "Tuliskan satu hal baik yang kamu capai hari ini."
        ],
        'Biasa Saja': [
            "Tidak apa-apa merasa biasa saja. Coba regangkan badan atau jalan-jalan sebentar.",
            "Hari yang pas untuk merencanakan sesuatu yang menyenangkan di akhir pekan.",
            "Coba tonton film atau serial komedi untuk menaikkan mood.",
            "Hubungi teman lama untuk sekadar mengobrol dan tertawa bersama.",
            "Berikan dirimu hadiah kecil, seperti camilan favorit."
        ],
        'Buruk': [
            "Ingat, perasaan ini akan berlalu. Coba tarik napas dalam-dalam.",
            "Pergi berlibur atau jalan-jalan ke tempat yang kamu suka bisa membantu.",
            "Bicaralah dengan teman atau keluarga yang kamu percaya tentang perasaanmu.",
            "Coba lakukan peregangan ringan atau meditasi 5 menit.",
            "Dengarkan lagu yang membuatmu merasa damai."
        ],
        'Sangat Buruk': [
            "Tidak apa-apa untuk tidak baik-baik saja. Beri dirimu waktu untuk istirahat.",
            "Lakukan aktivitas yang menenangkan, seperti mandi air hangat atau membaca buku.",
            "Jangan ragu untuk mencari bantuan profesional jika perasaan ini berlanjut.",
            "Ingatkan dirimu bahwa kamu tidak sendiri, ada orang yang peduli padamu.",
            "Tuliskan perasaanmu di jurnal, biarkan pikiranmu sedikit lebih lega."
        ]
    };


    // --- Fungsi untuk memuat dan menampilkan riwayat ---
    const loadMoodHistory = () => {
        const history = JSON.parse(localStorage.getItem('moodHistory')) || [];
        historyList.innerHTML = ''; 
        history.forEach(entry => addEntryToDOM(entry));
    };

    // --- Fungsi untuk menambahkan entri ke DOM ---
    const addEntryToDOM = (entry) => {
        const listItem = document.createElement('li');
        listItem.className = 'history-item';
        const emoji = moodEmojis[entry.mood];
        const formattedDate = new Date(entry.timestamp).toLocaleString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        listItem.innerHTML = `<span>${emoji} ${entry.mood}</span><small>${formattedDate}</small>`;
        historyList.prepend(listItem);
    };
    
    // --- Fungsi untuk menyimpan entri mood ---
    const saveMoodEntry = (mood) => {
        const history = JSON.parse(localStorage.getItem('moodHistory')) || [];
        const newEntry = { mood: mood, timestamp: new Date().toISOString() };
        history.unshift(newEntry);
        localStorage.setItem('moodHistory', JSON.stringify(history));
        addEntryToDOM(newEntry);
    };

    // --- BARU: Fungsi untuk menampilkan Modal Saran ---
    const showSuggestionModal = (mood) => {
        // Ambil array saran berdasarkan mood
        const moodSuggestions = suggestions[mood];
        // Pilih satu saran secara acak dari array
        const randomSuggestion = moodSuggestions[Math.floor(Math.random() * moodSuggestions.length)];

        // Isi konten modal
        modalEmoji.textContent = moodEmojis[mood];
        modalTitle.textContent = `Kamu merasa ${mood}`;
        modalSuggestion.textContent = randomSuggestion;

        // Tampilkan modal
        suggestionModal.classList.remove('hidden');
    };

    // --- BARU: Fungsi untuk menyembunyikan Modal Saran ---
    const hideSuggestionModal = () => {
        suggestionModal.classList.add('hidden');
    };

    // --- DIUBAH: Event Listener untuk setiap tombol mood ---
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.dataset.mood;
            saveMoodEntry(mood);      // Langkah 1: Simpan mood
            showSuggestionModal(mood); // Langkah 2: Tampilkan saran
        });
    });

    // --- BARU: Event Listener untuk menutup modal ---
    closeModalBtn.addEventListener('click', hideSuggestionModal);

    // Menutup modal saat mengklik area overlay (di luar konten modal)
    suggestionModal.addEventListener('click', (event) => {
        if (event.target === suggestionModal) {
            hideSuggestionModal();
        }
    });

    // --- Memuat riwayat saat halaman pertama kali dibuka ---
    loadMoodHistory();
    localStorage.clear();
});
