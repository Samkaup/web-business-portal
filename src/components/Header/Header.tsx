type Props = {
  title?: string;
};

export default function Header({ title = 'Company ehf.' }: Props) {
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-content-between">
            <h1 className="text-lg font-semibold leading-6 text-gray-900">
              {title}
            </h1>
          </div>
        </div>
      </header>
    </>
  );
}
