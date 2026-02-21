import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🍽️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button icon={Home}>Go Home</Button>
          </Link>
          <Link to="/restaurants">
            <Button variant="outline" icon={Search}>Browse Restaurants</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
