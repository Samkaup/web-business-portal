import { Separator } from '@/components/Shadcn/ui/separator';

export default async function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Tilkynningar</h3>
        <p className="text-sm text-muted-foreground">
          Hér getur þú sillt tilkynningar sem verða sentar á netfangið þitt.
        </p>
      </div>
      <Separator />
    </div>
  );
}
