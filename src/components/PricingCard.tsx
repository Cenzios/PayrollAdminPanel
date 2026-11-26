import { Check, Edit } from 'lucide-react';
import { formatMoney } from '../utils/money';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  planName: string;
  /** Decimal string (money). */
  price: string;
  priceLabel: string;
  /** Decimal string (money). */
  registrationFee: string;
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
}: PricingCardProps): JSX.Element => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 tracking-wide uppercase">
        {planName} plan
      </h3>

      <div className="mb-2">
        {/* Price never wraps; the label drops to the next line if the card is too narrow */}
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="whitespace-nowrap text-2xl xl:text-3xl font-bold text-blue-600 tabular-nums">
            Rs {formatMoney(price)}
          </span>
          <span className="whitespace-nowrap text-gray-600 font-medium">{priceLabel}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-8">
        Rs {formatMoney(registrationFee)} (one time registration fee)
      </p>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                <Check className="text-white" size={14} />
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
