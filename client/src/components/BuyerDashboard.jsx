import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Package,
  Wrench
} from 'lucide-react';
import axios from 'axios';

export default function BuyerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'orders' | 'inputs'
  const [listings, setListings] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  
  // Checkout Modal State
  const [checkoutListing, setCheckoutListing] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(10);
  const [deliveryAddress, setDeliveryAddress] = useState('Apex Food Processing Ltd, Industrial Area, Bhopal');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);

  const fetchMarketplace = async () => {
    try {
      const res = await axios.get(`/api/listings/crop?search=${searchTerm}&state=${selectedState}`);
      setListings(res.data.listings || []);
    } catch (err) {
      console.error('Fetch marketplace error:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders?buyerId=buyer-1');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Fetch orders error:', err);
    }
  };

  const fetchInputs = async () => {
    try {
      const res = await axios.get('/api/listings/inputs');
      setInputs(res.data.inputs || []);
    } catch (err) {
      console.error('Fetch inputs error:', err);
    }
  };

  useEffect(() => {
    fetchMarketplace();
    fetchOrders();
    fetchInputs();
  }, [searchTerm, selectedState]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    try {
      const res = await axios.post('/api/orders', {
        buyerId: user?.id || 'buyer-1',
        buyerName: user?.name || 'Amit Agrotech Mills',
        buyerPhone: user?.phone || '+91 99001 22334',
        listingId: checkoutListing.id,
        quantity: orderQuantity,
        agreedPrice: checkoutListing.askingPrice,
        deliveryAddress
      });

      if (res.data.success) {
        setCheckoutSuccess(res.data.order);
        fetchOrders();
        setTimeout(() => {
          setCheckoutListing(null);
          setCheckoutSuccess(null);
          setActiveTab('orders');
        }, 2000);
      }
    } catch (err) {
      console.error('Place order error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Selectors */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'marketplace'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          Direct Farm Produce Market
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Truck className="h-4 w-4" />
          My Orders & Logistics ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('inputs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inputs'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Wrench className="h-4 w-4" />
          Agri-Inputs & Rentals
        </button>
      </div>

      {/* ================= MARKETPLACE TAB ================= */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crops (e.g. Wheat, Basmati, Tomato, Chana)..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none w-full sm:w-auto"
              >
                <option value="All">All States (भारत भर)</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Haryana">Haryana</option>
              </select>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="relative h-44 w-full bg-slate-100">
                    <img src={item.images[0]} alt={item.cropName} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 right-2.5 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      Direct Farm Gate
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-emerald-400" />
                      {item.district}, {item.state}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {item.cropName}
                      </h4>
                      <span className="text-xs font-extrabold text-blue-700 whitespace-nowrap">
                        ₹{item.askingPrice} <span className="text-[10px] text-slate-400 font-normal">/ Qtl</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Fair Value Benchmark Pill */}
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">MSP Benchmark:</span>
                      <span className="font-bold text-slate-800">₹{item.mspPrice}</span>
                      <span className="text-emerald-700 font-semibold">
                        Forecast: ₹{item.forecastPrice}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                      <span>Available: <strong>{item.quantity} {item.unit}</strong></span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <ShieldCheck className="h-3.5 w-3.5" /> Farmer {item.farmerName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      setCheckoutListing(item);
                      setOrderQuantity(Math.min(10, item.quantity));
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    Buy Direct with Escrow Protection
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ORDERS TAB ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Your Procurement Orders & Tracking</h3>
            <p className="text-xs text-slate-500 mb-6">Real-time status updates from farm gate to mill delivery</p>

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Order #{order.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        {order.cropName} — {order.quantity} {order.unit}
                      </h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-blue-700">₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Paid via Razorpay ({order.paymentId})
                      </span>
                    </div>
                  </div>

                  {/* Delivery Timeline Checkpoints */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Transit Timeline:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {order.trackingUpdates?.map((step, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {step.status}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">{step.note}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {new Date(step.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center justify-between pt-2">
                    <span>Pickup Date: <strong>{order.pickupDate}</strong></span>
                    <span>Destination: <strong>{order.deliveryAddress}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= INPUTS MARKETPLACE TAB ================= */}
      {activeTab === 'inputs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {inputs.map((inp) => (
            <div key={inp.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <img src={inp.image} alt={inp.itemName} className="h-40 w-full object-cover" />
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {inp.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{inp.itemName}</h4>
                  <div className="text-sm font-extrabold text-slate-900">
                    ₹{inp.price} <span className="text-xs font-normal text-slate-500">/ {inp.rentalUnit}</span>
                  </div>
                  <p className="text-xs text-slate-500">{inp.location}</p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <button
                  onClick={() => alert(`Inquiry sent to ${inp.sellerName}`)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Contact Equipment Provider
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= CHECKOUT / PAYMENT MODAL ================= */}
      {checkoutListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="p-6 pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Confirm Order & Escrow Checkout</h3>
              <p className="text-xs text-slate-500">Direct Farmer Trade (Razorpay Sandbox Mode)</p>
            </div>

            <form onSubmit={handlePlaceOrder} className="p-6 space-y-4">
              {checkoutSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-semibold space-y-1">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-1" />
                  <p className="text-sm font-bold">Payment Verified Successfully!</p>
                  <p>Order #{checkoutSuccess.id} created and dispatched to farmer.</p>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-800">{checkoutListing.cropName}</div>
                    <div className="text-slate-500">Seller: Farmer {checkoutListing.farmerName} ({checkoutListing.district})</div>
                    <div className="font-semibold text-blue-700">Rate: ₹{checkoutListing.askingPrice} / Quintal</div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Purchase Quantity (Quintals, max {checkoutListing.quantity})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={checkoutListing.quantity}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-lg font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Delivery Address / Mandi Hub
                    </label>
                    <textarea
                      rows="2"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                      required
                    />
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-900">Total Payable Amount:</span>
                    <span className="text-base font-black text-emerald-950">
                      ₹{(orderQuantity * checkoutListing.askingPrice).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutListing(null)}
                      className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={checkoutLoading}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      {checkoutLoading ? 'Processing Razorpay...' : 'Pay via Razorpay'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
