import * as Dialog from '@radix-ui/react-dialog';

export default function ButtonComponent() {
  return (
    <Dialog.Root>
      {/* زر لفتح الـ Dialog */}
      <Dialog.Trigger className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
        Open Dialog
      </Dialog.Trigger>
      
      {/* الـ Overlay خلفية مظلمة نصف شفافة */}
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />

      {/* محتوى الـ Dialog */}
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-card text-foreground rounded-xl shadow-lg border border-border max-w-md w-full">
        <Dialog.Title className="text-lg font-semibold">Dialog Title</Dialog.Title>
        <Dialog.Description className="mt-2 text-muted-foreground text-sm">
          This is a dialog description
        </Dialog.Description>

        {/* زر لإغلاق الـ Dialog */}
        <Dialog.Close className="mt-4 px-4 py-2 bg-destructive text-foreground rounded-md hover:bg-destructive/90 transition text-sm">
          Close
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
}
