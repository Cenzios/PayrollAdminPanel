import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setPageTitle } from '../store/uiSlice';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/axios';
import { useToast } from '../components/ToastContext';
import PricingCard from '../components/PricingCard';
import EditPlanModal from '../components/EditPlanModal';
import SuccessModal from '../components/SuccessModal';
import { createPortal } from 'react-dom';
import { isAxiosError } from 'axios';
import { toPlanView } from '../utils/planView';
import type { Plan, PlanUpdatePayload, SubscriptionPlanView } from '../types';
import type { ApiEnvelope } from '../auth/authTypes';

const Subscriptions = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanView | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Edit Subscription Plans' }));
  }, [dispatch]);

  const { data: plansData, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async (): Promise<SubscriptionPlanView[]> => {
      const response = await api.get<ApiEnvelope<Plan[]>>('/admin/plans');
      return response.data.data.map(toPlanView);
    },
  });

  const plans = plansData || [];

  const handleEdit = (plan: SubscriptionPlanView): void => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: PlanUpdatePayload): Promise<ApiEnvelope<Plan>> => {
      const response = await api.put<ApiEnvelope<Plan>>(`/admin/plans/${encodeURIComponent(id)}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setIsSuccessModalOpen(true);
    },
    onError: (error: unknown) => {
      console.error('Failed to save plan:', error);
      const serverMessage = isAxiosError<{ error?: string; message?: string }>(error)
        ? error.response?.data?.error || error.response?.data?.message
        : undefined;
      showToast(serverMessage || 'Failed to update plan', 'error');
    }
  });

  const handleSavePlan = async (payload: PlanUpdatePayload): Promise<void> => {
    await updateMutation.mutateAsync(payload);
  };

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 text-center py-10 text-gray-400">Loading plans...</div>
        ) : plans.map((plan) => (
          <PricingCard
            key={plan.id}
            planName={plan.name}
            price={plan.price}
            priceLabel={plan.priceLabel}
            registrationFee={plan.registrationFee}
            features={plan.features}
            onEdit={() => handleEdit(plan)}
          />
        ))}
      </div>

      {/* Edit Plan Modal */}
      {isEditModalOpen && createPortal(
        <EditPlanModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSavePlan}
          plan={selectedPlan}
        />,
        document.body
      )}

      {/* Success Confirmation Modal */}
      {isSuccessModalOpen && createPortal(
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title="Success Confirmation"
          message="Plan details have been updated successfully."
        />,
        document.body
      )}
    </div>
  );
};

export default Subscriptions;
