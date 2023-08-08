import Logo from '@/components/Logo/Logo';
import Image from 'next/image';
const navigation = {
  company: [
    { name: 'Fréttir', href: 'https://www.samkaup.is/frettir/' },
    { name: 'Um Samkaup', href: 'https://www.samkaup.is/um-samkaup/' },
    {
      name: 'Samfélagið',
      href: 'https://www.samkaup.is/um-samkaup/samfelagid/',
    },
    { name: 'Verslanir', href: 'https://www.samkaup.is/verslanir/' },
  ],
  support: [
    { name: 'Hafa samband', href: 'https://www.samkaup.is/hafa-samband/' },
    { name: 'Persónuvernd', href: 'https://www.samkaup.is/personuvernd/' },
    { name: 'Skilmálar', href: 'https://www.samkaup.is/skilmalar/' },
  ],

  social: [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/Samkaup-106538184851569/',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Logo variant="blue"></Logo>
            <p className="text-sm leading-6 text-gray-600">
              <span className="block">© Samkaup hf.</span>
              <span className="block">Krossmóa 4 - 260 Reykjanesbær</span>
              <span className="block">
                S: <a href="tel:+3544215400">421-5400</a>
              </span>
              <span className="block">
                <a href="mailto:bokhald@samkaup.is">bokhald@samkaup.is</a>
              </span>
              <span className="block">kt. 571298-3769 - VSK nr. 60594</span>
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Fyrirtækið
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Upplýsingar
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="flex items-baseline">
                <Image
                  src="https://www.samkaup.is/wp-content/uploads/2022/10/vidurkenning_merki_2022_gull.png"
                  width={75}
                  height={75}
                  alt="Jafnvægisvog"
                ></Image>
                <Image
                  src="https://www.samkaup.is/wp-content/uploads/2022/01/Jafnlaunavottun_2022_2025_f_dokkan_grunn.png"
                  width={125}
                  height={125}
                  alt="Jafnvægisvog"
                ></Image>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} Samkaup hf. Allur réttur áskilinn.
          </p>
        </div>
      </div>
    </footer>
  );
}
