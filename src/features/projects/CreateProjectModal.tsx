import { useState } from 'react';
import { X, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(3, { message: 'Project title is required' }),
  description: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: ProjectFormValues) => void;
}

export function CreateProjectModal({ isOpen, onClose, onCreate }: Props) {
  const [step, setStep] = useState<1 | 2>(1);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  if (!isOpen) return null;

  const handleNext = async () => {
    const isStepValid = await trigger('title');
    if (isStepValid) setStep(2);
  };

  const onSubmit = (data: ProjectFormValues) => {
    onCreate(data);
    reset();
    setStep(1);
    onClose();
  };

  const handleClose = () => {
    reset();
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded bg-surface-container-lowest shadow-popover">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant p-4">
          <div>
            <h2 className="text-headline-md font-semibold text-on-surface">Create New Project</h2>
            <p className="text-label-md text-outline">
              Step {step} of 2: Project {step === 1 ? 'Title' : 'Description'}
            </p>
          </div>
          <button onClick={handleClose} className="rounded p-1 text-outline hover:bg-surface-container hover:text-on-surface transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-[2px] w-full bg-surface-container">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        {/* Form Body */}
        <div className="p-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-body-sm font-semibold text-on-surface">
                  Project Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
                  placeholder="e.g., Highway Expansion Project"
                />
                {errors.title && <p className="mt-1 text-label-sm text-error">{errors.title.message}</p>}
              </div>
              <div className="flex items-start gap-2 rounded bg-surface-container-low p-2 text-body-sm text-on-surface-variant border border-outline-variant">
                <Info className="h-4 w-4 flex-shrink-0 text-outline mt-0.5" />
                <p>You can add team members and assign resources in the next step.</p>
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-body-sm font-semibold text-on-surface">
                Description <span className="font-normal text-outline">(Optional)</span>
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="block w-full resize-none rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
                placeholder="Describe the project goals, scope, and key deliverables..."
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-outline-variant bg-surface-container-lowest p-3 px-4 rounded-b">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="h-8 px-3 text-body-sm font-medium text-primary hover:bg-surface-container rounded transition-colors"
            >
              Back
            </button>
          )}
          {step === 1 ? (
            <button
              onClick={handleNext}
              className="flex h-8 items-center gap-1.5 rounded bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit(onSubmit)}
              className="flex h-8 items-center gap-1.5 rounded bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
            >
              Create Project
            </button>
          )}
        </div>

      </div>
    </div>
  );
}