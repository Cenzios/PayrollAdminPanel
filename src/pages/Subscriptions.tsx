import { useState, useEffect } from 'react';
import PricingCard from '../components/PricingCard';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchPlans, updatePlanData } from '../store/subscriptionSlice';
import EditPlanModal from '../components/EditPlanModal';
import SuccessModal from '../components/SuccessModal';

const Subscriptions = () => {
  const dispatch = useAppDispatch();
  const { plans } = useAppSelector(
    (state) => state.subscription
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleSavePlan = async (payload: { id: string; data: any }) => {
    try {
      await dispatch(updatePlanData(payload)).unwrap();
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Failed to save plan:', error);
      alert('Failed to update plan');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
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
