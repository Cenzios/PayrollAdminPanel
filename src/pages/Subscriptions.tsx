import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/axios';
import PricingCard from '../components/PricingCard';
import EditPlanModal from '../components/EditPlanModal';
import SuccessModal from '../components/SuccessModal';

const Subscriptions = () => {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Hardcoded features as requested
  const getHardcodedFeatures = (planName: string) => {
    const commonFeatures = [
      { text: 'Automatic salary & deduction calculations', included: true },
      { text: 'Monthly payslip generation (PDF / CSV / Excel', included: true },
      { text: 'Employee profile management', included: true },
      { text: 'Manage multiple company', included: true },
      { text: 'Payroll report generations', included: true },
      { text: 'Secure dashboard for administrators', included: true },
    ];

    if (planName.toUpperCase().includes('BASIC')) {
      return [{ text: 'Payroll processing for 0 - 29 employees', included: true }, ...commonFeatures];
    } else if (planName.toUpperCase().includes('PROFESSIONAL')) {
      return [{ text: 'Payroll processing for 30 - 99 employees', included: true }, ...commonFeatures];
    } else {
      return [{ text: 'Payroll processing for 100 or more employees', included: true }, ...commonFeatures];
    }
  };

  const { data: plansData, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await api.get('/admin/plans');
      return response.data.data.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        price: plan.employeePrice,
        priceLabel: 'Per employee',
        registrationFee: plan.registrationFee,
        maxEmployees: plan.maxEmployees,
        features: getHardcodedFeatures(plan.name),
      }));
    },
  });

  const plans = plansData || [];

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/admin/plans/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setIsSuccessModalOpen(true);
    },
    onError: (error: any) => {
      console.error('Failed to save plan:', error);
      alert('Failed to update plan');
    }
  });

  const handleSavePlan = async (payload: { id: string; data: any }) => {
    return updateMutation.mutateAsync(payload);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 text-center py-10 text-gray-400">Loading plans...</div>
        ) : plans.map((plan: any) => (
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
      <EditPlanModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSavePlan}
        plan={selectedPlan}
      />

      {/* Success Confirmation Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Success Confirmation"
        message="Plan details have been updated successfully."
      />
    </div>
  );
};

export default Subscriptions;
