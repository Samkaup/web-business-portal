'use client';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/Shadcn/ui/form';
import toast from 'react-hot-toast';
import { Switch } from '@/components/Shadcn/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Collapsible,
  CollapsibleContent
} from '@/components/Shadcn/ui/collapsible';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { useGetProfile } from '@/utils/react_query_hooks/profile';
import { BellIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import supabaseBrowser from '@/utils/supabase-browser';
import { Slider } from '@/components/Shadcn/ui/slider';
import { Separator } from '@/components/Shadcn/ui/separator';
import { Label } from '@/components/Shadcn/ui/label';
import Button from '@/components/ui/Button/Button';

const notificationsFormSchema = z.object({
  notificationsOn: z.boolean().optional(),
  emailNotifications: z.object({
    on: z.boolean()
  }),
  webNotifications: z.object({
    on: z.boolean()
  }),
  limitNotifications: z.object({
    on: z.boolean(),
    percentage: z.number().min(0).max(100).default(100)
  })
});

type NotificationsSchema = z.infer<typeof notificationsFormSchema>;

const defaultSettings = {
  notificationsOn: true,
  webNotifications: {
    on: true
  },
  emailNotifications: {
    on: true
  },
  limitNotifications: {
    on: false,
    percentage: 80
  }
};

export default function SettingsNotificationsPage() {
  const { data: userProfile, isSuccess } = useGetProfile();

  const form = useForm<NotificationsSchema>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: defaultSettings
  });

  useEffect(() => {
    if (isSuccess) {
      form.reset({
        ...defaultSettings,
        ...(userProfile.profile.notificationSettings as NotificationsSchema)
      });
    }
  }, [isSuccess]);

  const onSubmit = (data: NotificationsSchema) => {
    supabaseBrowser
      .from('profile')
      .update({ notificationSettings: data })
      .eq('id', userProfile.profile.id)
      .then(({ error }) => {
        if (error) {
          toast.error('Ekki var hægt að uppfæra tilkynningar');
          console.error(error);
          return;
        }
        toast.success('Tilkynningar uppfærðar');
      });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Tilkynningar</h3>
        <p className="text-sm text-muted-foreground">
          Hér getur þú styllt tilkynningar sem þú færð frá okkur.
        </p>
      </div>
      <Separator />
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <Collapsible
                open={form.getValues('notificationsOn')}
                className="w-full space-y-2"
              >
                <CollapsibleTrigger asChild>
                  <FormField
                    control={form.control}
                    name="notificationsOn"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Allar tilkynningar
                          </FormLabel>
                          <FormDescription>
                            Leyfa allar tilkynningar frá okkur
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  <Separator className="my-5" />
                  <h3 className="text-lg font-medium">
                    Hvar viltu fá tilkynningar?
                  </h3>
                  <>
                    <FormField
                      control={form.control}
                      name="emailNotifications.on"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Vef tilkynningar
                            </FormLabel>
                            <FormDescription className="flex items-center ">
                              Leyfa tilkynningar á vafra
                              <BellIcon
                                className="h-4 w-4 ml-1"
                                aria-hidden="true"
                              />
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="webNotifications.on"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Tölvupósts tilkynningar
                            </FormLabel>
                            <FormDescription>
                              Leyfa að senda tölvupósts tilkynningar á netfangið{' '}
                              {userProfile?.user?.email}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>

                  <h3 className="text-lg font-medium">Nákvæmari stillingar</h3>
                  <Collapsible
                    open={form.getValues('limitNotifications.on')}
                    className="rounded-lg border p-4"
                  >
                    <CollapsibleTrigger asChild>
                      <FormField
                        control={form.control}
                        name="limitNotifications.on"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Heimilda tilkynningar
                              </FormLabel>
                              <FormDescription>
                                Leyfa að senda tilkynningar þegar ákveðin
                                prósenta af heimildinni hefur verið notuð
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2">
                      <FormField
                        control={form.control}
                        name="limitNotifications.percentage"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-center justify-between">
                            <div className="flex w-full items-center justify-between mt-3">
                              <Label htmlFor="maxlength">
                                Heimilda prósenta
                              </Label>
                              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                                {field.value}%
                              </span>
                            </div>
                            <FormControl>
                              <Slider
                                onValueChange={(value) =>
                                  field.onChange(value[0])
                                }
                                defaultValue={[
                                  form.getValues(
                                    'limitNotifications.percentage'
                                  )
                                ]}
                                max={100}
                                step={1}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </CollapsibleContent>
              </Collapsible>
            </div>
            <Button type="submit">Uppfæra</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
