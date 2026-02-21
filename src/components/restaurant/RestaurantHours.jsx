import { Clock, Check, X } from 'lucide-react';
import { formatTime, getDayName, isRestaurantOpen } from '../../utils/helpers';

const RestaurantHours = ({ hours, showFullWeek = false, className = '' }) => {
  const today = getDayName();
  const currentStatus = isRestaurantOpen(hours);

  if (!showFullWeek) {
    const todayHours = hours[today.toLowerCase()];
    
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Clock className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${currentStatus ? 'text-green-600' : 'text-red-500'}`}>
            {currentStatus ? 'Open' : 'Closed'}
          </span>
          {todayHours && !todayHours.closed && (
            <span className="text-sm text-gray-500">
              • {formatTime(todayHours.open)} - {formatTime(todayHours.close)}
            </span>
          )}
        </div>
      </div>
    );
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Opening Hours
      </h4>
      <div className="space-y-1">
        {days.map((day, index) => {
          const dayHours = hours[day];
          const isToday = day === today.toLowerCase();
          
          return (
            <div 
              key={day}
              className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                isToday ? 'bg-primary-50' : 'hover:bg-gray-50'
              }`}
            >
              <span className={`text-sm ${isToday ? 'font-semibold text-primary-600' : 'text-gray-600'}`}>
                {dayLabels[index]}
                {isToday && <span className="ml-2 text-xs text-primary-500">(Today)</span>}
              </span>
              {dayHours?.closed ? (
                <span className="text-sm text-red-500 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Closed
                </span>
              ) : dayHours ? (
                <span className={`text-sm ${isToday ? 'font-medium text-primary-600' : 'text-gray-700'}`}>
                  {formatTime(dayHours.open)} - {formatTime(dayHours.close)}
                </span>
              ) : (
                <span className="text-sm text-gray-400">Not available</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RestaurantHours;
