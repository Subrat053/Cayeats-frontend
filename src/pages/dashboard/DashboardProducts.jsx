import { useState } from 'react';
import { 
  Package, Plus, Edit3, Trash2, Eye, Image, Video, FileText, Map, 
  Upload, X, CheckCircle, Star, Sparkles, Crown, CreditCard, 
  Search, Filter, MoreVertical, ExternalLink, Info
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const DashboardProducts = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);

  // Current plan
  const [currentPlan] = useState({
    tier: 'professional',
    name: 'Professional',
    productsUsed: 8,
    productsLimit: 15,
    imagesPerProduct: 5,
    video: false,
    storeMap: false,
    docs: false,
    expiresAt: '2025-08-15',
    billing: 'semiAnnual',
  });

  // Product plans (from admin pricing, semi-annual & annual only, no transaction fee)
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      semiAnnual: 99,
      annual: 179,
      products: 5,
      imagesPerProduct: 3,
      video: false,
      storeMap: false,
      docs: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      semiAnnual: 199,
      annual: 349,
      products: 15,
      imagesPerProduct: 5,
      video: false,
      storeMap: false,
      docs: false,
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      semiAnnual: 399,
      annual: 699,
      products: 100,
      imagesPerProduct: 10,
      video: true,
      storeMap: true,
      docs: true,
    },
  ];

  // Mock products
  const [products] = useState([
    { id: 1, name: 'Jerk Chicken Platter', category: 'Main Course', price: 18.99, images: 3, status: 'published', views: 342, orders: 89 },
    { id: 2, name: 'Fish Tacos', category: 'Main Course', price: 14.99, images: 2, status: 'published', views: 256, orders: 64 },
    { id: 3, name: 'Coconut Shrimp', category: 'Appetizer', price: 12.99, images: 4, status: 'published', views: 198, orders: 45 },
    { id: 4, name: 'Mango Smoothie', category: 'Beverages', price: 6.99, images: 1, status: 'draft', views: 0, orders: 0 },
    { id: 5, name: 'Caribbean Rice Bowl', category: 'Main Course', price: 15.99, images: 3, status: 'published', views: 167, orders: 38 },
    { id: 6, name: 'Key Lime Pie', category: 'Dessert', price: 8.99, images: 2, status: 'published', views: 134, orders: 29 },
    { id: 7, name: 'Island Burger', category: 'Main Course', price: 16.99, images: 5, status: 'published', views: 289, orders: 72 },
    { id: 8, name: 'Conch Fritters', category: 'Appetizer', price: 10.99, images: 3, status: 'draft', views: 0, orders: 0 },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    images: [],
  });

  const currentPlanData = plans.find(p => p.id === currentPlan.tier);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products &amp; Dishes</h1>
          <p className="text-gray-600 mt-1">Feature your dishes, recipes &amp; images — linked to your restaurant profile</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowPlanSelector(true)}>
            <Crown className="w-4 h-4 mr-2" />
            {currentPlan.name} Plan
          </Button>
          <Button
            onClick={() => setShowCreateForm(true)}
            disabled={currentPlan.productsUsed >= currentPlanData?.products}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Plan Usage Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="font-medium text-gray-900">{currentPlan.name} Plan</span>
            <Badge variant="secondary" size="sm">Semi-Annual</Badge>
          </div>
          <span className="text-sm text-gray-600">
            {currentPlan.productsUsed} / {currentPlanData?.products} products used
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${currentPlan.productsUsed / currentPlanData?.products > 0.9 ? 'bg-red-500' : 'bg-primary'}`}
            style={{ width: `${(currentPlan.productsUsed / currentPlanData?.products) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>{currentPlanData?.products - currentPlan.productsUsed} products remaining</span>
          <span>Up to {currentPlanData?.imagesPerProduct} images per product
            {currentPlanData?.video && ' · Video'}
            {currentPlanData?.storeMap && ' · Store Map'}
            {currentPlanData?.docs && ' · Docs'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, color: 'text-primary' },
          { label: 'Published', value: products.filter(p => p.status === 'published').length, color: 'text-green-600' },
          { label: 'Total Views', value: products.reduce((s, p) => s + p.views, 0).toLocaleString(), color: 'text-blue-600' },
          { label: 'Total Orders', value: products.reduce((s, p) => s + p.orders, 0).toLocaleString(), color: 'text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Your Products</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search products..." className="text-sm bg-transparent focus:outline-none w-40" />
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select className="text-sm bg-transparent focus:outline-none">
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Images</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Views</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Orders</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image className="w-5 h-5 text-gray-400" />
                      </div>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                  <td className="py-3 px-4 text-center text-sm font-medium">${product.price}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-sm ${product.images >= currentPlanData?.imagesPerProduct ? 'text-orange-600' : 'text-gray-600'}`}>
                      {product.images}/{currentPlanData?.imagesPerProduct}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">{product.views}</td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">{product.orders}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={product.status === 'published' ? 'success' : 'default'} size="sm">
                      {product.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"><Edit3 className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Form */}
      {showCreateForm && (
        <Card className="border-2 border-primary">
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>Add New Product</Card.Title>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)} icon={X} />
            </div>
          </Card.Header>
          <Card.Content className="pt-6">
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); console.log('Adding product:', newProduct); }}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Product Name *</label>
                  <Input value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g., Jerk Chicken Platter" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select category</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Side Dish">Side Dish</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Price ($)</label>
                  <Input type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                  <Input value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Short description..." />
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Product Images (max {currentPlanData?.imagesPerProduct})
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
                  <input type="file" accept="image/*" multiple className="mt-2" />
                </div>
              </div>

              {/* Enterprise-only extras */}
              {currentPlan.tier === 'enterprise' && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <Video className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Video Upload</p>
                    <input type="file" accept="video/*" className="mt-2 text-xs" />
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <Map className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Store Map</p>
                    <input type="file" accept="image/*" className="mt-2 text-xs" />
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Documents</p>
                    <input type="file" accept=".pdf,.doc,.docx" className="mt-2 text-xs" />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1" disabled={!newProduct.name}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      )}

      {/* Plan Selector */}
      {showPlanSelector && (
        <Card className="border-2 border-primary">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <Card.Title>Choose Your Product Plan</Card.Title>
                <Card.Description>Semi-Annual &amp; Annual only — <strong>Zero transaction fee</strong> on all plans</Card.Description>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPlanSelector(false)} icon={X} />
            </div>
          </Card.Header>
          <Card.Content className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map(plan => (
                <div
                  key={plan.id}
                  className={`rounded-xl border-2 p-6 ${plan.popular ? 'border-primary bg-primary/5' : plan.id === currentPlan.tier ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                >
                  {plan.popular && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full mb-3">
                      <Sparkles className="w-3 h-3" /> Most Popular
                    </span>
                  )}
                  {plan.id === currentPlan.tier && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full mb-3">
                      <CheckCircle className="w-3 h-3" /> Current Plan
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    {plan.products} products · {plan.imagesPerProduct} images
                    {plan.video && ' · Video'}{plan.storeMap && ' · Maps'}{plan.docs && ' · Docs'}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${plan.semiAnnual}</span>
                      <span className="text-gray-500 text-sm"> /6 months</span>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${plan.annual}</span>
                      <span className="text-gray-500 text-sm"> /year</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{plan.products} product listings</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{plan.imagesPerProduct} images per product</li>
                    {plan.video && <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Video uploads</li>}
                    {plan.storeMap && <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Store map</li>}
                    {plan.docs && <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Document uploads</li>}
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Zero transaction fee</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Links to restaurant profile</li>
                  </ul>
                  {plan.id === currentPlan.tier ? (
                    <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                  ) : (
                    <Button className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {plan.semiAnnual > (currentPlanData?.semiAnnual || 0) ? 'Upgrade' : 'Switch'} to {plan.name}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <strong>Product listings</strong> appear on your restaurant profile page. 
          There is <strong>zero transaction fee</strong> on all product plans. 
          Upgrade your plan to add more products, images, video, store maps, and document uploads.
        </div>
      </div>
    </div>
  );
};

export default DashboardProducts;
