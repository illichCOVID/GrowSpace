export default function Footer() {
  return (
    <footer className="bg-green-50 text-gray-700 py-10 px-6 md:px-20 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Лого і опис */}
        <div>
          <h3 className="text-2xl font-bold text-green-700 mb-2">GrowSpace 🌱</h3>
          <p className="text-sm">
            Створи свій зелений простір разом з нами. Досліджуй, вирощуй, продавай.
          </p>
        </div>

        {/* Швидкі посилання */}
        <div>
          <h4 className="font-semibold mb-3">Навігація</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-green-600 transition">Головна</a></li>
            <li><a href="/plantsfooter" className="hover:text-green-600 transition">Рослини</a></li>
            <li><a href="/marketfooter" className="hover:text-green-600 transition">Маркетплейс</a></li>
            <li><a href="/aboutfooter" className="hover:text-green-600 transition">Про нас</a></li>
          </ul>
        </div>

        {/* Контакти */}
        <div>
          <h4 className="font-semibold mb-3">Контакти</h4>
          <p className="text-sm">support@growspace.com</p>
          <p className="text-sm">+38 (097) 211 40 44</p>
          <p className="text-sm">Київ, Україна</p>
        </div>

        {/* Соцмережі */}
        <div>
          <h4 className="font-semibold mb-3">Слідкуй за нами</h4>
          <div className="flex space-x-4 text-green-700">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-green-600 transition"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.5 2a.75.75 0 1 1 0 1.5a.75.75 0 0 1 0-1.5ZM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-green-600 transition"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5 2h-3A5.5 5.5 0 0 0 5 7.5V11H2v3h3v8h4v-8h3l1-3h-4V7.5a1.5 1.5 0 0 1 1.5-1.5h2V2Z"/>
              </svg>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="hover:text-green-600 transition"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.944 2.486a1.26 1.26 0 0 0-1.278-.168L2.475 10.15c-.53.217-.868.715-.866 1.284c.002.57.342 1.066.874 1.28l3.977 1.593v4.655a1.278 1.278 0 0 0 2.09 1.017l2.644-2.152l4.198 3.34a1.28 1.28 0 0 0 2.058-.697l4.24-16.335a1.26 1.26 0 0 0-.746-1.55Zm-6.758 6.783l-6.143 6.97l-1.903 1.547v-2.973l6.982-5.837a.75.75 0 0 1 .964 1.153Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Права */}
      <div className="text-center text-xs mt-10 text-gray-500">
        © {new Date().getFullYear()} GrowSpace. Всі права захищені.
      </div>
    </footer>
  );
}
