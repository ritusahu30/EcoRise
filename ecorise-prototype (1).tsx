import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Camera, Upload, Recycle, Heart, Gift, Search, Tag, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Enhanced mock data for household items
const mockItems = [
  { 
    id: 1, 
    name: "Bulk Cotton Clothing", 
    category: "Textiles", 
    quantity: "50 kg",
    price: 75, 
    condition: "Used",
    type: "recycle",
    description: "Mixed cotton clothing suitable for textile recycling",
    businessUse: "Textile recycling, fiber extraction"
  },
  { 
    id: 2, 
    name: "Winter Clothing Bundle", 
    category: "Clothing", 
    quantity: "20 pieces",
    price: 45, 
    condition: "Gently Used",
    type: "donate",
    description: "Warm winter clothes including jackets and sweaters",
    suitableFor: "Families in need during winter"
  },
  { 
    id: 3, 
    name: "Plastic Containers Bulk", 
    category: "Plastics", 
    quantity: "30 kg",
    price: 25, 
    condition: "Used",
    type: "recycle",
    description: "Mixed household plastic containers",
    businessUse: "Plastic recycling, manufacturing"
  },
  { 
    id: 4, 
    name: "Children's Books", 
    category: "Educational", 
    quantity: "50 books",
    price: 35, 
    condition: "Good",
    type: "donate",
    description: "Mixed children's books for ages 5-12",
    suitableFor: "School libraries, community centers"
  }
];

// Enhanced analytics data
const analyticsData = [
  { month: 'Jan', recycledMaterials: 1200, donatedItems: 450, businessPurchases: 850 },
  { month: 'Feb', recycledMaterials: 1500, donatedItems: 550, businessPurchases: 950 },
  { month: 'Mar', recycledMaterials: 1800, donatedItems: 650, businessPurchases: 1050 }
];

const MaterialCategories = () => {
  const categories = [
    { name: "Textiles", icon: <Tag className="text-blue-500" /> },
    { name: "Plastics", icon: <Recycle className="text-green-500" /> },
    { name: "Paper/Books", icon: <Heart className="text-red-500" /> },
    { name: "Household", icon: <Users className="text-purple-500" /> }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {categories.map(category => (
        <Card key={category.name} className="p-4 cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center space-y-2">
            {category.icon}
            <span className="font-medium">{category.name}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

const RecommendationEngine = ({ items }) => {
  // Enhanced ML-based recommendation (mock)
  const getRecommendedPrice = (item) => {
    const basePrice = item.price;
    const marketDemand = item.type === 'recycle' ? 1.2 : 1.0; // Higher demand for recyclables
    const condition = item.condition === "Good" ? 1.1 : 0.9;
    return (basePrice * condition * marketDemand).toFixed(2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {items.map(item => (
        <Card key={item.id} className="p-4">
          <CardHeader>
            <CardTitle className="text-lg">{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-medium">{item.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-medium">{item.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Suggested Price:</span>
                <span className="font-medium">${getRecommendedPrice(item)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              {item.businessUse && (
                <p className="text-sm text-green-600">Business Use: {item.businessUse}</p>
              )}
              {item.suitableFor && (
                <p className="text-sm text-blue-600">Suitable For: {item.suitableFor}</p>
              )}
              <div className="flex gap-2 mt-4">
                {item.type === 'recycle' && (
                  <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                    <Recycle size={16} className="text-green-500" />
                    <span className="text-sm">For Recycling Business</span>
                  </div>
                )}
                {item.type === 'donate' && (
                  <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                    <Gift size={16} className="text-blue-500" />
                    <span className="text-sm">For Donation</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AnalyticsDashboard = ({ data }) => {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Impact Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64">
          <LineChart data={data} width={600} height={200}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="recycledMaterials" name="Recycled (kg)" stroke="#82ca9d" />
            <Line type="monotone" dataKey="donatedItems" name="Donated Items" stroke="#8884d8" />
            <Line type="monotone" dataKey="businessPurchases" name="Business Purchases" stroke="#ffc658" />
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
};

const MaterialUpload = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
    }, 1500);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>List Materials</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>
            <select className="w-full p-2 border rounded">
              <option>Textiles & Clothing</option>
              <option>Plastic Materials</option>
              <option>Paper & Books</option>
              <option>Household Items</option>
              <option>Electronics</option>
              <option>Metals</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Purpose</label>
            <select className="w-full p-2 border rounded">
              <option>For Recycling Business</option>
              <option>For Donation</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg border-gray-300">
          <div className="text-center space-y-4">
            <Camera size={48} className="mx-auto text-gray-400" />
            <div className="flex flex-col items-center">
              <button 
                onClick={handleUpload}
                className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
              >
                <Upload size={20} />
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EcoRisePrototype = () => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowAlert(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {showAlert && (
        <Alert className="mb-6">
          <AlertTitle>Welcome to EcoRise!</AlertTitle>
          <AlertDescription>
            Connect with recycling businesses and support communities in need through sustainable material management.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">EcoRise Marketplace</h1>
        <p className="text-gray-600">Transforming household materials into valuable resources</p>
      </div>

      <MaterialCategories />
      <MaterialUpload />
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Available Materials & Donations</h2>
        <RecommendationEngine items={mockItems} />
      </div>

      <AnalyticsDashboard data={analyticsData} />
    </div>
  );
};

export default EcoRisePrototype;
