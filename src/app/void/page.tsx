import Logo from '@/components/Logo/Logo';
import Button from '@/components/ui/Button/Button';

export default function Void() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center">
        <Logo width={250} variant="blue" />
      </div>
      <h3 className="text-lg text-center">
        Engin fyrirtæki fundust undir aðganginum þínum.{' '}
      </h3>

      <p className="text-sm text-company text-muted-foreground w-full text-center">
        Reyndu að skrá þig út og aftur inn. Ef það virakr ekki, hafðu samband
        við okkur í síma 421-5400 og við lögum þetta.
      </p>
      <form method="POST" action="/auth/signout">
        <Button className="w-full flex justify-center" type="submit">
          <div className="flex gap-2 justify-center">Útskrá</div>
        </Button>
      </form>
    </div>
  );
}
