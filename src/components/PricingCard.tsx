import { Check, Edit } from 'lucide-react';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  planName: string;
  price: number;
  priceLabel: string;
  registrationFee: number;
  features: PricingFeature[];
  onEdit?: () => void;
}

const PricingCard = ({
  planName,
  price,
  priceLabel,
  registrationFee,
  features,
  onEdit,
}: PricingCardProps) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-wide">
        {planName}
      </h3>

      <div className="mb-2">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-gray-900">Rs: {price}</span>
          <span className="ml-2 text-gray-600">{priceLabel}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-8">
        Rs: {registrationFee.toLocaleString()} (one time registration fee)
      </p>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <Check className="text-blue-600" size={14} />
              </div>
            </div>
            <span className="text-sm text-gray-700">{feature.text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onEdit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        <span>Edit</span>
        <Edit size={16} />
      </button>
    </div>
  );
};

export default PricingCard;
