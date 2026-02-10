import { database } from '@core/database';
import Product from '@core/database/models/Product';
import Category from '@core/database/models/Category';

interface SeedCategory {
  name: string;
  icon: string;
}

interface SeedProduct {
  name: string;
  categoryName: string;
  purchasePrice: number;
  sellingPrice: number;
  unit: string;
  lowStockThreshold: number;
  stockMin: number;
  stockMax: number;
}

const CATEGORIES: SeedCategory[] = [
  { name: 'Dal & Pulses', icon: 'grain' },
  { name: 'Rice & Flour', icon: 'barley' },
  { name: 'Spices & Masala', icon: 'shaker-outline' },
  { name: 'Oil & Ghee', icon: 'bottle-tonic' },
  { name: 'Sugar & Salt', icon: 'cube-outline' },
  { name: 'Tea & Coffee', icon: 'coffee' },
  { name: 'Snacks & Namkeen', icon: 'food-variant' },
  { name: 'Biscuits & Bakery', icon: 'cookie' },
  { name: 'Beverages', icon: 'cup-water' },
  { name: 'Dairy Products', icon: 'cow' },
  { name: 'Soap & Detergent', icon: 'hand-wash' },
  { name: 'Personal Care', icon: 'face-man-shimmer' },
  { name: 'Papad & Pickle', icon: 'food-drumstick' },
  { name: 'Dry Fruits', icon: 'peanut' },
  { name: 'Pooja Items', icon: 'candle' },
];

const PRODUCTS: SeedProduct[] = [
  // ── Dal & Pulses ──
  { name: 'Toor Dal', categoryName: 'Dal & Pulses', purchasePrice: 120, sellingPrice: 140, unit: 'kg', lowStockThreshold: 10, stockMin: 15, stockMax: 80 },
  { name: 'Chana Dal', categoryName: 'Dal & Pulses', purchasePrice: 80, sellingPrice: 95, unit: 'kg', lowStockThreshold: 10, stockMin: 15, stockMax: 60 },
  { name: 'Moong Dal', categoryName: 'Dal & Pulses', purchasePrice: 100, sellingPrice: 120, unit: 'kg', lowStockThreshold: 8, stockMin: 10, stockMax: 50 },
  { name: 'Urad Dal', categoryName: 'Dal & Pulses', purchasePrice: 110, sellingPrice: 130, unit: 'kg', lowStockThreshold: 8, stockMin: 10, stockMax: 40 },
  { name: 'Masoor Dal', categoryName: 'Dal & Pulses', purchasePrice: 85, sellingPrice: 100, unit: 'kg', lowStockThreshold: 8, stockMin: 10, stockMax: 40 },
  { name: 'Mag (Whole Moong)', categoryName: 'Dal & Pulses', purchasePrice: 110, sellingPrice: 130, unit: 'kg', lowStockThreshold: 5, stockMin: 8, stockMax: 30 },
  { name: 'Chola (Kabuli Chana)', categoryName: 'Dal & Pulses', purchasePrice: 90, sellingPrice: 110, unit: 'kg', lowStockThreshold: 5, stockMin: 8, stockMax: 30 },
  { name: 'Matki (Moth Bean)', categoryName: 'Dal & Pulses', purchasePrice: 95, sellingPrice: 115, unit: 'kg', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Val Dal', categoryName: 'Dal & Pulses', purchasePrice: 100, sellingPrice: 120, unit: 'kg', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },

  // ── Rice & Flour ──
  { name: 'Basmati Rice', categoryName: 'Rice & Flour', purchasePrice: 80, sellingPrice: 100, unit: 'kg', lowStockThreshold: 15, stockMin: 20, stockMax: 100 },
  { name: 'Sona Masoori Rice', categoryName: 'Rice & Flour', purchasePrice: 50, sellingPrice: 60, unit: 'kg', lowStockThreshold: 15, stockMin: 20, stockMax: 100 },
  { name: 'Kolam Rice', categoryName: 'Rice & Flour', purchasePrice: 45, sellingPrice: 55, unit: 'kg', lowStockThreshold: 15, stockMin: 20, stockMax: 80 },
  { name: 'Ghau no Lot (Wheat Flour)', categoryName: 'Rice & Flour', purchasePrice: 35, sellingPrice: 42, unit: 'kg', lowStockThreshold: 20, stockMin: 25, stockMax: 100 },
  { name: 'Chakki Atta (5 kg)', categoryName: 'Rice & Flour', purchasePrice: 180, sellingPrice: 210, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 50 },
  { name: 'Bajri no Lot (Millet Flour)', categoryName: 'Rice & Flour', purchasePrice: 40, sellingPrice: 50, unit: 'kg', lowStockThreshold: 5, stockMin: 8, stockMax: 30 },
  { name: 'Juwar no Lot (Sorghum Flour)', categoryName: 'Rice & Flour', purchasePrice: 42, sellingPrice: 52, unit: 'kg', lowStockThreshold: 5, stockMin: 8, stockMax: 30 },
  { name: 'Makai no Lot (Corn Flour)', categoryName: 'Rice & Flour', purchasePrice: 38, sellingPrice: 48, unit: 'kg', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Besan (Gram Flour)', categoryName: 'Rice & Flour', purchasePrice: 70, sellingPrice: 85, unit: 'kg', lowStockThreshold: 8, stockMin: 10, stockMax: 40 },
  { name: 'Rava (Sooji)', categoryName: 'Rice & Flour', purchasePrice: 40, sellingPrice: 50, unit: 'kg', lowStockThreshold: 5, stockMin: 8, stockMax: 30 },
  { name: 'Maida', categoryName: 'Rice & Flour', purchasePrice: 35, sellingPrice: 42, unit: 'kg', lowStockThreshold: 5, stockMin: 8, stockMax: 25 },
  { name: 'Poha (Flattened Rice)', categoryName: 'Rice & Flour', purchasePrice: 45, sellingPrice: 55, unit: 'kg', lowStockThreshold: 5, stockMin: 8, stockMax: 30 },

  // ── Spices & Masala ──
  { name: 'Haldi (Turmeric) Powder', categoryName: 'Spices & Masala', purchasePrice: 160, sellingPrice: 200, unit: 'kg', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Mirch (Red Chilli) Powder', categoryName: 'Spices & Masala', purchasePrice: 200, sellingPrice: 250, unit: 'kg', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Dhania (Coriander) Powder', categoryName: 'Spices & Masala', purchasePrice: 140, sellingPrice: 170, unit: 'kg', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Jeera (Cumin) Whole', categoryName: 'Spices & Masala', purchasePrice: 280, sellingPrice: 340, unit: 'kg', lowStockThreshold: 3, stockMin: 3, stockMax: 15 },
  { name: 'Rai (Mustard Seeds)', categoryName: 'Spices & Masala', purchasePrice: 80, sellingPrice: 100, unit: 'kg', lowStockThreshold: 3, stockMin: 3, stockMax: 15 },
  { name: 'Hing (Asafoetida)', categoryName: 'Spices & Masala', purchasePrice: 900, sellingPrice: 1100, unit: 'kg', lowStockThreshold: 1, stockMin: 1, stockMax: 5 },
  { name: 'Garam Masala', categoryName: 'Spices & Masala', purchasePrice: 300, sellingPrice: 380, unit: 'kg', lowStockThreshold: 3, stockMin: 3, stockMax: 10 },
  { name: 'Chai Masala', categoryName: 'Spices & Masala', purchasePrice: 350, sellingPrice: 440, unit: 'kg', lowStockThreshold: 2, stockMin: 2, stockMax: 8 },
  { name: 'Sabji Masala', categoryName: 'Spices & Masala', purchasePrice: 200, sellingPrice: 260, unit: 'kg', lowStockThreshold: 3, stockMin: 3, stockMax: 10 },
  { name: 'Ajmo (Carom Seeds)', categoryName: 'Spices & Masala', purchasePrice: 200, sellingPrice: 250, unit: 'kg', lowStockThreshold: 2, stockMin: 2, stockMax: 8 },
  { name: 'Methi Dana (Fenugreek)', categoryName: 'Spices & Masala', purchasePrice: 100, sellingPrice: 130, unit: 'kg', lowStockThreshold: 2, stockMin: 2, stockMax: 8 },
  { name: 'Kali Mirch (Black Pepper)', categoryName: 'Spices & Masala', purchasePrice: 600, sellingPrice: 750, unit: 'kg', lowStockThreshold: 2, stockMin: 2, stockMax: 5 },
  { name: 'Lavang (Cloves)', categoryName: 'Spices & Masala', purchasePrice: 1000, sellingPrice: 1250, unit: 'kg', lowStockThreshold: 1, stockMin: 1, stockMax: 3 },
  { name: 'Elachi (Cardamom)', categoryName: 'Spices & Masala', purchasePrice: 2000, sellingPrice: 2500, unit: 'kg', lowStockThreshold: 1, stockMin: 1, stockMax: 3 },
  { name: 'Taj (Cinnamon)', categoryName: 'Spices & Masala', purchasePrice: 400, sellingPrice: 500, unit: 'kg', lowStockThreshold: 1, stockMin: 1, stockMax: 5 },

  // ── Oil & Ghee ──
  { name: 'Singtel (Groundnut Oil) 1L', categoryName: 'Oil & Ghee', purchasePrice: 180, sellingPrice: 210, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 50 },
  { name: 'Singtel (Groundnut Oil) 5L', categoryName: 'Oil & Ghee', purchasePrice: 850, sellingPrice: 980, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Sunflower Oil 1L', categoryName: 'Oil & Ghee', purchasePrice: 130, sellingPrice: 155, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Soybean Oil 1L', categoryName: 'Oil & Ghee', purchasePrice: 110, sellingPrice: 130, unit: 'pcs', lowStockThreshold: 8, stockMin: 10, stockMax: 40 },
  { name: 'Mustard Oil 1L', categoryName: 'Oil & Ghee', purchasePrice: 160, sellingPrice: 190, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Pure Ghee 1L (Amul)', categoryName: 'Oil & Ghee', purchasePrice: 550, sellingPrice: 600, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Pure Ghee 500ml (Amul)', categoryName: 'Oil & Ghee', purchasePrice: 280, sellingPrice: 310, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Til Oil (Sesame Oil) 500ml', categoryName: 'Oil & Ghee', purchasePrice: 200, sellingPrice: 240, unit: 'pcs', lowStockThreshold: 3, stockMin: 3, stockMax: 15 },
  { name: 'Coconut Oil 500ml', categoryName: 'Oil & Ghee', purchasePrice: 120, sellingPrice: 145, unit: 'pcs', lowStockThreshold: 3, stockMin: 3, stockMax: 15 },

  // ── Sugar & Salt ──
  { name: 'Khand (Sugar)', categoryName: 'Sugar & Salt', purchasePrice: 40, sellingPrice: 48, unit: 'kg', lowStockThreshold: 20, stockMin: 25, stockMax: 100 },
  { name: 'Gol (Jaggery)', categoryName: 'Sugar & Salt', purchasePrice: 50, sellingPrice: 65, unit: 'kg', lowStockThreshold: 10, stockMin: 10, stockMax: 50 },
  { name: 'Mishri (Rock Sugar)', categoryName: 'Sugar & Salt', purchasePrice: 60, sellingPrice: 80, unit: 'kg', lowStockThreshold: 3, stockMin: 3, stockMax: 15 },
  { name: 'Tata Salt 1kg', categoryName: 'Sugar & Salt', purchasePrice: 22, sellingPrice: 28, unit: 'pcs', lowStockThreshold: 15, stockMin: 20, stockMax: 80 },
  { name: 'Sendha Namak (Rock Salt)', categoryName: 'Sugar & Salt', purchasePrice: 50, sellingPrice: 65, unit: 'kg', lowStockThreshold: 3, stockMin: 3, stockMax: 15 },
  { name: 'Kala Namak (Black Salt)', categoryName: 'Sugar & Salt', purchasePrice: 60, sellingPrice: 80, unit: 'kg', lowStockThreshold: 2, stockMin: 2, stockMax: 10 },

  // ── Tea & Coffee ──
  { name: 'Wagh Bakri Tea 250g', categoryName: 'Tea & Coffee', purchasePrice: 95, sellingPrice: 110, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 60 },
  { name: 'Wagh Bakri Tea 500g', categoryName: 'Tea & Coffee', purchasePrice: 185, sellingPrice: 215, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Tata Tea Gold 250g', categoryName: 'Tea & Coffee', purchasePrice: 100, sellingPrice: 120, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Red Label Tea 500g', categoryName: 'Tea & Coffee', purchasePrice: 190, sellingPrice: 225, unit: 'pcs', lowStockThreshold: 8, stockMin: 10, stockMax: 30 },
  { name: 'Nescafe Classic 50g', categoryName: 'Tea & Coffee', purchasePrice: 130, sellingPrice: 155, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Bru Instant Coffee 50g', categoryName: 'Tea & Coffee', purchasePrice: 110, sellingPrice: 130, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },

  // ── Snacks & Namkeen ──
  { name: 'Gathiya 200g', categoryName: 'Snacks & Namkeen', purchasePrice: 35, sellingPrice: 45, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 60 },
  { name: 'Chevdo 200g', categoryName: 'Snacks & Namkeen', purchasePrice: 40, sellingPrice: 50, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 60 },
  { name: 'Bhujiya Sev 200g', categoryName: 'Snacks & Namkeen', purchasePrice: 30, sellingPrice: 40, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 60 },
  { name: 'Tikha Papdi 200g', categoryName: 'Snacks & Namkeen', purchasePrice: 30, sellingPrice: 40, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Mamra (Puffed Rice)', categoryName: 'Snacks & Namkeen', purchasePrice: 60, sellingPrice: 80, unit: 'kg', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Farsi Puri 200g', categoryName: 'Snacks & Namkeen', purchasePrice: 40, sellingPrice: 50, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Khakhra Plain 200g', categoryName: 'Snacks & Namkeen', purchasePrice: 30, sellingPrice: 40, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Khakhra Methi 200g', categoryName: 'Snacks & Namkeen', purchasePrice: 35, sellingPrice: 45, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Banana Chips 200g', categoryName: 'Snacks & Namkeen', purchasePrice: 40, sellingPrice: 50, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Kurkure 70g', categoryName: 'Snacks & Namkeen', purchasePrice: 18, sellingPrice: 20, unit: 'pcs', lowStockThreshold: 20, stockMin: 20, stockMax: 80 },
  { name: 'Lays Chips 52g', categoryName: 'Snacks & Namkeen', purchasePrice: 18, sellingPrice: 20, unit: 'pcs', lowStockThreshold: 20, stockMin: 20, stockMax: 80 },

  // ── Biscuits & Bakery ──
  { name: 'Parle-G Biscuit', categoryName: 'Biscuits & Bakery', purchasePrice: 9, sellingPrice: 10, unit: 'pcs', lowStockThreshold: 30, stockMin: 30, stockMax: 120 },
  { name: 'Good Day Butter 75g', categoryName: 'Biscuits & Bakery', purchasePrice: 18, sellingPrice: 20, unit: 'pcs', lowStockThreshold: 20, stockMin: 20, stockMax: 80 },
  { name: 'Marie Gold 250g', categoryName: 'Biscuits & Bakery', purchasePrice: 35, sellingPrice: 40, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 60 },
  { name: 'Bourbon 150g', categoryName: 'Biscuits & Bakery', purchasePrice: 28, sellingPrice: 30, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 50 },
  { name: 'Monaco 200g', categoryName: 'Biscuits & Bakery', purchasePrice: 35, sellingPrice: 40, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Tiger Biscuit', categoryName: 'Biscuits & Bakery', purchasePrice: 9, sellingPrice: 10, unit: 'pcs', lowStockThreshold: 20, stockMin: 20, stockMax: 80 },
  { name: 'Oreo 120g', categoryName: 'Biscuits & Bakery', purchasePrice: 28, sellingPrice: 30, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Bread (Pav)', categoryName: 'Biscuits & Bakery', purchasePrice: 30, sellingPrice: 40, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 15 },
  { name: 'Rusk (Toast) 200g', categoryName: 'Biscuits & Bakery', purchasePrice: 25, sellingPrice: 30, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 30 },

  // ── Beverages ──
  { name: 'Thums Up 750ml', categoryName: 'Beverages', purchasePrice: 35, sellingPrice: 40, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 60 },
  { name: 'Coca Cola 750ml', categoryName: 'Beverages', purchasePrice: 35, sellingPrice: 40, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 60 },
  { name: 'Limca 750ml', categoryName: 'Beverages', purchasePrice: 35, sellingPrice: 40, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Frooti 200ml', categoryName: 'Beverages', purchasePrice: 9, sellingPrice: 10, unit: 'pcs', lowStockThreshold: 20, stockMin: 20, stockMax: 80 },
  { name: 'Maaza 250ml', categoryName: 'Beverages', purchasePrice: 18, sellingPrice: 20, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 60 },
  { name: 'Bisleri Water 1L', categoryName: 'Beverages', purchasePrice: 18, sellingPrice: 20, unit: 'pcs', lowStockThreshold: 20, stockMin: 20, stockMax: 80 },
  { name: 'Glucon-D 250g', categoryName: 'Beverages', purchasePrice: 65, sellingPrice: 80, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Rooh Afza 750ml', categoryName: 'Beverages', purchasePrice: 140, sellingPrice: 165, unit: 'pcs', lowStockThreshold: 3, stockMin: 3, stockMax: 12 },

  // ── Dairy Products ──
  { name: 'Amul Butter 100g', categoryName: 'Dairy Products', purchasePrice: 52, sellingPrice: 57, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 30 },
  { name: 'Amul Butter 500g', categoryName: 'Dairy Products', purchasePrice: 255, sellingPrice: 280, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 15 },
  { name: 'Amul Cheese 200g', categoryName: 'Dairy Products', purchasePrice: 95, sellingPrice: 108, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 15 },
  { name: 'Paneer 200g', categoryName: 'Dairy Products', purchasePrice: 70, sellingPrice: 80, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 15 },
  { name: 'Amul Taaza Milk 500ml', categoryName: 'Dairy Products', purchasePrice: 25, sellingPrice: 29, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 30 },
  { name: 'Chhash (Buttermilk) 200ml', categoryName: 'Dairy Products', purchasePrice: 12, sellingPrice: 15, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },

  // ── Soap & Detergent ──
  { name: 'Nirma Washing Powder 1kg', categoryName: 'Soap & Detergent', purchasePrice: 55, sellingPrice: 65, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Surf Excel 1kg', categoryName: 'Soap & Detergent', purchasePrice: 130, sellingPrice: 150, unit: 'pcs', lowStockThreshold: 8, stockMin: 8, stockMax: 30 },
  { name: 'Rin Bar', categoryName: 'Soap & Detergent', purchasePrice: 18, sellingPrice: 20, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 50 },
  { name: 'Vim Bar 300g', categoryName: 'Soap & Detergent', purchasePrice: 28, sellingPrice: 32, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Vim Liquid 500ml', categoryName: 'Soap & Detergent', purchasePrice: 90, sellingPrice: 105, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Lizol Floor Cleaner 500ml', categoryName: 'Soap & Detergent', purchasePrice: 105, sellingPrice: 125, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 15 },
  { name: 'Colin Glass Cleaner 500ml', categoryName: 'Soap & Detergent', purchasePrice: 85, sellingPrice: 100, unit: 'pcs', lowStockThreshold: 3, stockMin: 3, stockMax: 10 },

  // ── Personal Care ──
  { name: 'Lux Soap', categoryName: 'Personal Care', purchasePrice: 35, sellingPrice: 42, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 60 },
  { name: 'Dettol Soap', categoryName: 'Personal Care', purchasePrice: 40, sellingPrice: 48, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 50 },
  { name: 'Lifebuoy Soap', categoryName: 'Personal Care', purchasePrice: 32, sellingPrice: 38, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 50 },
  { name: 'Clinic Plus Shampoo 175ml', categoryName: 'Personal Care', purchasePrice: 75, sellingPrice: 90, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Head & Shoulders 180ml', categoryName: 'Personal Care', purchasePrice: 170, sellingPrice: 199, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 15 },
  { name: 'Colgate Toothpaste 100g', categoryName: 'Personal Care', purchasePrice: 48, sellingPrice: 56, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Pepsodent Toothpaste 150g', categoryName: 'Personal Care', purchasePrice: 60, sellingPrice: 72, unit: 'pcs', lowStockThreshold: 8, stockMin: 8, stockMax: 30 },
  { name: 'Dabur Lal Dant Manjan', categoryName: 'Personal Care', purchasePrice: 25, sellingPrice: 30, unit: 'pcs', lowStockThreshold: 8, stockMin: 8, stockMax: 30 },
  { name: 'Parachute Coconut Oil 200ml', categoryName: 'Personal Care', purchasePrice: 92, sellingPrice: 110, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Navratna Oil 200ml', categoryName: 'Personal Care', purchasePrice: 85, sellingPrice: 100, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Fair & Lovely 50g', categoryName: 'Personal Care', purchasePrice: 75, sellingPrice: 90, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 15 },

  // ── Papad & Pickle ──
  { name: 'Lijjat Papad 200g', categoryName: 'Papad & Pickle', purchasePrice: 38, sellingPrice: 45, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Moong Papad 200g', categoryName: 'Papad & Pickle', purchasePrice: 42, sellingPrice: 50, unit: 'pcs', lowStockThreshold: 8, stockMin: 8, stockMax: 30 },
  { name: 'Udad Papad 200g', categoryName: 'Papad & Pickle', purchasePrice: 38, sellingPrice: 45, unit: 'pcs', lowStockThreshold: 8, stockMin: 8, stockMax: 30 },
  { name: 'Gor Keri (Mango Pickle)', categoryName: 'Papad & Pickle', purchasePrice: 100, sellingPrice: 130, unit: 'kg', lowStockThreshold: 3, stockMin: 3, stockMax: 15 },
  { name: 'Lemon Pickle 400g', categoryName: 'Papad & Pickle', purchasePrice: 55, sellingPrice: 70, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Chundo (Sweet Mango)', categoryName: 'Papad & Pickle', purchasePrice: 110, sellingPrice: 140, unit: 'kg', lowStockThreshold: 3, stockMin: 3, stockMax: 10 },
  { name: 'Mixed Pickle 400g', categoryName: 'Papad & Pickle', purchasePrice: 60, sellingPrice: 75, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Green Chilli Pickle 400g', categoryName: 'Papad & Pickle', purchasePrice: 55, sellingPrice: 70, unit: 'pcs', lowStockThreshold: 3, stockMin: 3, stockMax: 15 },

  // ── Dry Fruits ──
  { name: 'Sing Dana (Peanuts)', categoryName: 'Dry Fruits', purchasePrice: 120, sellingPrice: 150, unit: 'kg', lowStockThreshold: 5, stockMin: 5, stockMax: 25 },
  { name: 'Kaju (Cashew)', categoryName: 'Dry Fruits', purchasePrice: 800, sellingPrice: 950, unit: 'kg', lowStockThreshold: 2, stockMin: 2, stockMax: 10 },
  { name: 'Badam (Almonds)', categoryName: 'Dry Fruits', purchasePrice: 700, sellingPrice: 850, unit: 'kg', lowStockThreshold: 2, stockMin: 2, stockMax: 10 },
  { name: 'Kishmish (Raisins)', categoryName: 'Dry Fruits', purchasePrice: 250, sellingPrice: 320, unit: 'kg', lowStockThreshold: 2, stockMin: 2, stockMax: 8 },
  { name: 'Khajur (Dates) 500g', categoryName: 'Dry Fruits', purchasePrice: 100, sellingPrice: 130, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
  { name: 'Copra (Dried Coconut)', categoryName: 'Dry Fruits', purchasePrice: 200, sellingPrice: 260, unit: 'kg', lowStockThreshold: 3, stockMin: 3, stockMax: 10 },

  // ── Pooja Items ──
  { name: 'Agarbatti (Incense)', categoryName: 'Pooja Items', purchasePrice: 25, sellingPrice: 35, unit: 'pcs', lowStockThreshold: 15, stockMin: 15, stockMax: 50 },
  { name: 'Dhoop Batti', categoryName: 'Pooja Items', purchasePrice: 18, sellingPrice: 25, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Kapoor (Camphor)', categoryName: 'Pooja Items', purchasePrice: 40, sellingPrice: 55, unit: 'pcs', lowStockThreshold: 8, stockMin: 8, stockMax: 30 },
  { name: 'Kumkum Powder', categoryName: 'Pooja Items', purchasePrice: 10, sellingPrice: 15, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Cotton Wicks (Vaat)', categoryName: 'Pooja Items', purchasePrice: 12, sellingPrice: 18, unit: 'pcs', lowStockThreshold: 10, stockMin: 10, stockMax: 40 },
  { name: 'Match Box', categoryName: 'Pooja Items', purchasePrice: 1, sellingPrice: 2, unit: 'pcs', lowStockThreshold: 30, stockMin: 30, stockMax: 100 },
  { name: 'Diya Oil 500ml', categoryName: 'Pooja Items', purchasePrice: 60, sellingPrice: 80, unit: 'pcs', lowStockThreshold: 5, stockMin: 5, stockMax: 20 },
];

function getRandomStock(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function seedProducts(): Promise<{ categories: number; products: number }> {
  const categoriesCollection = database.get<Category>('categories');
  const productsCollection = database.get<Product>('products');

  // Check if products already exist
  const existingProducts = await productsCollection.query().fetchCount();
  if (existingProducts > 0) {
    throw new Error('Products already exist. Clear existing data before seeding.');
  }

  const categoryMap = new Map<string, Category>();

  await database.write(async () => {
    // Create categories
    for (const cat of CATEGORIES) {
      const created = await categoriesCollection.create((c: Category) => {
        c.name = cat.name;
        c.icon = cat.icon;
      });
      categoryMap.set(cat.name, created);
    }

    // Create products
    for (const prod of PRODUCTS) {
      const category = categoryMap.get(prod.categoryName);
      await productsCollection.create((p: Product) => {
        p.name = prod.name;
        if (category) {
          p.category.set(category);
        }
        p.purchasePrice = prod.purchasePrice;
        p.sellingPrice = prod.sellingPrice;
        p.unit = prod.unit;
        p.barcode = '';
        p.lowStockThreshold = prod.lowStockThreshold;
        p.currentStock = getRandomStock(prod.stockMin, prod.stockMax);
        p.isActive = true;
      });
    }
  });

  return { categories: CATEGORIES.length, products: PRODUCTS.length };
}

export async function clearAllProducts(): Promise<void> {
  const productsCollection = database.get<Product>('products');
  const categoriesCollection = database.get<Category>('categories');

  await database.write(async () => {
    const allProducts = await productsCollection.query().fetch();
    const allCategories = await categoriesCollection.query().fetch();

    const batch: Product[] | Category[] = [];
    for (const product of allProducts) {
      batch.push(product.prepareDestroyPermanently() as unknown as Product);
    }
    for (const category of allCategories) {
      batch.push(category.prepareDestroyPermanently() as unknown as Category);
    }

    await database.batch(...batch);
  });
}
