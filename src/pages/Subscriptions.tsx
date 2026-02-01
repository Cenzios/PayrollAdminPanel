import { Edit } from 'lucide-react';
import PricingCard from '../components/PricingCard';
import { useAppSelector } from '../store/hooks';

const Subscriptions = () => {
  const { plans, additionalSlotPrice } = useAppSelector(
    (state) => state.subscription
  );

  const handleEdit = (planId: string) => {
    console.log('Edit plan:', planId);
  };

  const handleEditSlotPrice = () => {
    console.log('Edit slot price');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
          Crate new Plan
        </button>
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
            onEdit={() => handleEdit(plan.id)}
          />
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Additional Slots
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Exceeding plan employee limits
            </p>
            <div className="bg-white rounded-lg p-4 inline-block">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Current Price
              </p>
              <p className="text-2xl font-bold text-gray-900">
                Rs: {additionalSlotPrice}
                <span className="text-sm font-normal text-gray-600 ml-2">
                  per slot
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={handleEditSlotPrice}
            className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>Edit</span>
            <Edit size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
