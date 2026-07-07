const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/reviews', require('./routes/reviews'));
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

const SEED_TRIPS = [
  { title:'Bir Billing Escape',slug:'bir-billing-escape',type:'trip',description:'Paragliding capital of India meets bohemian mountain culture. Wake up to cloud-level views, sip chai at rooftop cafes, and feel the Himalayas breathe.',image:'https://images.unsplash.com/photo-1571623005610-a7a9f7a6f4c5?w=1200&q=85',location:'Bir, Himachal Pradesh',duration:'3 Days / 2 Nights',price:6499,seatsAvailable:12,difficulty:'easy',experienceType:'hills',whoIsItFor:['solo','group'],vibeTags:['Paragliding','Mountains','Cafes'],included:['Camp/homestay accommodation','All meals','Paragliding session','Trip leader','First aid kit'],excluded:['Travel to Bir','Personal expenses','Travel insurance'],stayType:'Shared camp + local homestay',stayDescription:'Cozy camps with mountain views run by local families.',localTransport:'Pick-up from Pathankot on request.',importantNotes:'Carry warm clothes. Minimum fitness required for paragliding.' },
  { title:'Kasol Camp Weekend',slug:'kasol-camp-weekend',type:'trip',description:'Parvati Valley magic — riverside camping, Israeli cafes, pine forests, and the kind of peace that city life forgot to pack.',image:'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=85',location:'Kasol, Parvati Valley, HP',duration:'2 Days / 1 Night',price:4299,seatsAvailable:8,difficulty:'easy',experienceType:'forests',whoIsItFor:['solo','group','couple'],vibeTags:['Camping','Rivers','Cafes','Chill'],included:['Riverside tent stay','Dinner and breakfast','Bonfire night','Trip leader'],excluded:['Travel to Kasol','Lunch','Personal expenses'],stayType:'Riverside tents',stayDescription:'Tents pitched right next to the Parvati river.',localTransport:'Volvo from Delhi available.',importantNotes:'Carry layers. Respect local culture.' },
  { title:'Manali Family Escape',slug:'manali-family-escape',type:'trip',description:'Snow-capped peaks, Solang Valley fun, and safe comfortable stays the whole family will love.',image:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85',location:'Manali, Himachal Pradesh',duration:'4 Days / 3 Nights',price:12999,seatsAvailable:14,difficulty:'easy',experienceType:'hills',whoIsItFor:['family','group'],vibeTags:['Snow','Family','Safe'],included:['3-star hotel stay','Daily breakfast and dinner','Solang Valley visit','Local sightseeing','Trip manager'],excluded:['Travel to Manali','Lunch','Snow gear rental'],stayType:'3-star hotel',stayDescription:'Centrally heated rooms with mountain views.',localTransport:'Volvo from Delhi. Private cab for sightseeing.',importantNotes:'Carry warm clothes. Rohtang permit arranged by team.' },
  { title:'Pondicherry Coastal Wander',slug:'pondicherry-coastal-wander',type:'trip',description:'French Quarter streets, sunrise beaches, filter coffee, and a vibe that rewires you completely.',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85',location:'Pondicherry',duration:'3 Days / 2 Nights',price:7299,seatsAvailable:10,difficulty:'easy',experienceType:'beaches',whoIsItFor:['solo','couple','group'],vibeTags:['Beach','Cafes','Culture'],included:['Boutique guesthouse','Daily breakfast','Heritage walk','Auroville visit','Beach sunrise'],excluded:['Travel to Pondicherry','Lunch and dinner','Personal expenses'],stayType:'Boutique heritage guesthouse',stayDescription:'Whitewashed walls and quiet lanes in the French Quarter.',localTransport:'Train from Chennai. Scooter rental available.',importantNotes:'Dress modestly for Ashram areas. Best Oct–March.' },
  { title:'Triund Night Trek',slug:'triund-night-trek',type:'trek',description:'Trek at dusk, arrive at sunset, sleep under the stars. Dharamshala lights below, Milky Way above.',image:'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=1200&q=85',location:'Dharamshala, HP',duration:'2 Days / 1 Night',price:3799,seatsAvailable:10,difficulty:'easy',experienceType:'hills',whoIsItFor:['solo','group'],vibeTags:['Night Trek','Stargazing','Camping'],included:['Summit camp stay','Dinner and breakfast','Trek guide','First aid','Bonfire'],excluded:['Travel to Dharamshala','Lunch','Personal gear'],stayType:'Mountain summit camp',stayDescription:'Tents at 2850m with panoramic Dhauladhar views.',localTransport:'Cab from Dharamshala to McLeod Ganj.',importantNotes:'Moderate fitness required. Carry warm layers.' },
  { title:'Kheerganga Group Trek',slug:'kheerganga-group-trek',type:'trek',description:'Hot springs at the summit, bonfire at base. This trek has ended friendships and started them on the same trip.',image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85',location:'Parvati Valley, HP',duration:'2 Days / 1 Night',price:3499,seatsAvailable:7,difficulty:'moderate',experienceType:'forests',whoIsItFor:['group','solo'],vibeTags:['Hot Springs','Forest','Bonfire'],included:['Camp at Kheerganga','Dinner and breakfast','Trek guide','Hot spring access','Bonfire'],excluded:['Travel to Barshaini','Lunch','Personal gear'],stayType:'Tented camp at summit',stayDescription:'Camps with hot spring access and snow peak views.',localTransport:'Bus to Bhuntar then cab to Barshaini.',importantNotes:'12km one way. Good fitness required.' },
  { title:'Hampta Pass Expedition',slug:'hampta-pass-expedition',type:'trek',description:'Cross a Himalayan pass at 14100 feet from lush Kullu valley to stark Spiti moonscape.',image:'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200&q=85',location:'Kullu to Spiti, HP',duration:'5 Days / 4 Nights',price:13999,seatsAvailable:10,difficulty:'challenging',experienceType:'hills',whoIsItFor:['group','solo'],vibeTags:['Pass Crossing','Snow','Glaciers'],included:['All camp stays','All meals','High-altitude guide','Porter support','Permits','Emergency oxygen'],excluded:['Travel to Manali','Personal trekking gear','Travel insurance'],stayType:'Progressive high-altitude camps',stayDescription:'Camps from 2800m to 4270m with dining tent.',localTransport:'Volvo to Manali. Trek transport arranged.',importantNotes:'Prior trekking experience required. Not for beginners.' },
  { title:'Kedarkantha Winter Trek',slug:'kedarkantha-winter-trek',type:'trek',description:'India\'s most beloved winter trek. Snow forests, frozen meadows, and 360-degree Himalayan views at 12500 feet.',image:'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=85',location:'Uttarkashi, Uttarakhand',duration:'6 Days / 5 Nights',price:16999,seatsAvailable:8,difficulty:'high-altitude',experienceType:'hills',whoIsItFor:['solo','group'],vibeTags:['Snow Summit','Winter','Himalayan Views'],included:['All camp stays','All meals','Certified guide','Porter support','Camping gear','Permits','Emergency oxygen'],excluded:['Travel to Sankri','Personal winter gear','Travel insurance'],stayType:'Snow camps + village homestay',stayDescription:'Insulated tents rated to -10C. Hot meals twice daily.',localTransport:'Cab from Dehradun to Sankri.',importantNotes:'Best Dec–March. Carry quality winter gear.' },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    const Admin = require('./models/Admin');
    const bcrypt = require('bcryptjs');
    const Trip = require('./models/Trip');
    const Inquiry = require('./models/Inquiry');

    const ea = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!ea && process.env.ADMIN_EMAIL) {
      await Admin.create({ email: process.env.ADMIN_EMAIL, password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12) });
      console.log('✅ Admin seeded');
    }
    if (await Trip.countDocuments() === 0) {
      await Trip.insertMany(SEED_TRIPS);
      console.log('✅ Trips seeded');
    }

    // Re-engagement cron — runs daily at 10am
    cron.schedule('0 10 * * *', async () => {
      console.log('Running re-engagement cron...');
      const { sendReminderEmail } = require('./utils/email');
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const pending = await Inquiry.find({ status: 'pending', reminded: false, createdAt: { $gte: threeDaysAgo, $lte: oneDayAgo } });
      for (const inq of pending) {
        const trip = await Trip.findOne({ title: inq.selectedTrip });
        await sendReminderEmail(inq, trip);
        await Inquiry.findByIdAndUpdate(inq._id, { reminded: true });
      }
      console.log(`Reminded ${pending.length} inquiries`);
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });
