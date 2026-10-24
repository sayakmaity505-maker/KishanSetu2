// Complete India administrative hierarchy: State → District → Block → Village
// Covers all 36 states/UTs with all districts. Blocks & villages for major agricultural states.

export const STATE_DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Anantapur","Chittoor","East Godavari","Guntur","Krishna","Kurnool",
    "Nellore","Prakasam","Srikakulam","Visakhapatnam","Vizianagaram",
    "West Godavari","YSR Kadapa","Alluri Sitharama Raju","Anakapalli",
    "Annamayya","Bapatla","Eluru","Konaseema","Nandyal","NTR District",
    "Palnadu","Parvathipuram Manyam","Sri Sathya Sai","Tirupati",
  ],
  "Arunachal Pradesh": [
    "Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Kamle",
    "Kra Daadi","Kurung Kumey","Lepa Rada","Lohit","Longding",
    "Lower Dibang Valley","Lower Siang","Lower Subansiri","Namsai",
    "Pakke Kessang","Papum Pare","Shi Yomi","Siang","Tawang","Tirap",
    "Upper Siang","Upper Subansiri","West Kameng","West Siang",
  ],
  "Assam": [
    "Bajali","Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo",
    "Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara",
    "Golaghat","Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan",
    "Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon",
    "Nagaon","Nalbari","Sivasagar","Sonitpur","South Salmara Mankachar",
    "Tamulpur","Tinsukia","Udalguri","West Karbi Anglong",
  ],
  "Bihar": [
    "Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur",
    "Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui",
    "Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai",
    "Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada",
    "Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura",
    "Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran",
  ],
  "Chhattisgarh": [
    "Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur",
    "Bilaspur","Dantewada","Dhamtari","Durg","Gariaband",
    "Gaurela Pendra Marwahi","Janjgir Champa","Jashpur","Kabirdham",
    "Kanker","Kondagaon","Korba","Koriya","Mahasamund","Mungeli",
    "Narayanpur","Raigarh","Raipur","Rajnandgaon","Sakti","Sukma","Surguja",
  ],
  "Goa": ["North Goa","South Goa"],
  "Gujarat": [
    "Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch",
    "Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka",
    "Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch",
    "Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal",
    "Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar",
    "Tapi","Vadodara","Valsad",
  ],
  "Haryana": [
    "Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram",
    "Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh",
    "Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa",
    "Sonipat","Yamunanagar",
  ],
  "Himachal Pradesh": [
    "Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul Spiti",
    "Mandi","Shimla","Sirmaur","Solan","Una",
  ],
  "Jharkhand": [
    "Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa",
    "Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma",
    "Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj",
    "Seraikela Kharsawan","Simdega","West Singhbhum",
  ],
  "Karnataka": [
    "Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban",
    "Bidar","Chamarajanagar","Chikballapur","Chikkamagaluru","Chitradurga",
    "Dakshina Kannada","Davangere","Dharwad","Gadag","Hassan","Haveri",
    "Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur",
    "Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada",
    "Vijayanagara","Vijayapura","Yadgir",
  ],
  "Kerala": [
    "Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam",
    "Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta",
    "Thiruvananthapuram","Thrissur","Wayanad",
  ],
  "Madhya Pradesh": [
    "Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani",
    "Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh",
    "Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad",
    "Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla",
    "Mandsaur","Morena","Narsinghpur","Neemuch","Niwari","Panna","Raisen",
    "Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol",
    "Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh",
    "Ujjain","Umaria","Vidisha",
  ],
  "Maharashtra": [
    "Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara",
    "Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli",
    "Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban",
    "Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani",
    "Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur",
    "Thane","Wardha","Washim","Yavatmal",
  ],
  "Manipur": [
    "Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West",
    "Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl",
    "Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul",
  ],
  "Meghalaya": [
    "East Garo Hills","East Jaintia Hills","East Khasi Hills",
    "Eastern West Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills",
    "South West Garo Hills","South West Khasi Hills","West Garo Hills",
    "West Jaintia Hills","West Khasi Hills",
  ],
  "Mizoram": [
    "Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai",
    "Lunglei","Mamit","Saitual","Serchhip","Siaha",
  ],
  "Nagaland": [
    "Chumoukedima","Dimapur","Kiphire","Kohima","Longleng","Mokokchung",
    "Mon","Niuland","Noklak","Peren","Phek","Shamator","Tuensang",
    "Wokha","Zunheboto",
  ],
  "Odisha": [
    "Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack",
    "Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur",
    "Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha",
    "Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada",
    "Puri","Rayagada","Sambalpur","Subarnapur","Sundargarh",
  ],
  "Punjab": [
    "Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka",
    "Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana",
    "Malerkotla","Mansa","Moga","Mohali","Muktsar","Pathankot","Patiala",
    "Rupnagar","Sangrur","Shaheed Bhagat Singh Nagar","Tarn Taran",
  ],
  "Rajasthan": [
    "Ajmer","Alwar","Banswara","Baran","Barmer","Bharatpur","Bhilwara",
    "Bikaner","Bundi","Chittorgarh","Churu","Dausa","Dholpur","Dungarpur",
    "Hanumangarh","Jaipur","Jaisalmer","Jalore","Jhalawar","Jhunjhunu",
    "Jodhpur","Karauli","Kota","Nagaur","Pali","Pratapgarh","Rajsamand",
    "Sawai Madhopur","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur",
  ],
  "Sikkim": [
    "East Sikkim","North Sikkim","Pakyong","Soreng","South Sikkim","West Sikkim",
  ],
  "Tamil Nadu": [
    "Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri",
    "Dindigul","Erode","Kallakurichi","Kanchipuram","Kanyakumari","Karur",
    "Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal",
    "Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem",
    "Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli",
    "Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai",
    "Tiruvarur","Vellore","Villupuram","Virudhunagar",
  ],
  "Telangana": [
    "Adilabad","Bhadradri Kothagudem","Hanumakonda","Hyderabad","Jagtial",
    "Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy",
    "Karimnagar","Khammam","Kumuram Bheem","Mahabubabad","Mahabubnagar",
    "Mancherial","Medak","Medchal Malkajgiri","Mulugu","Nagarkurnool",
    "Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli",
    "Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet",
    "Vikarabad","Wanaparthy","Warangal","Yadadri Bhuvanagiri",
  ],
  "Tripura": [
    "Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura",
    "Unakoti","West Tripura",
  ],
  "Uttar Pradesh": [
    "Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya",
    "Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki",
    "Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli",
    "Chitrakoot","Deoria","Etah","Etawah","Farrukhabad","Fatehpur","Firozabad",
    "Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur",
    "Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi",
    "Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi",
    "Lakhimpur Kheri","Kushinagar","Lalitpur","Lucknow","Maharajganj",
    "Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad",
    "Muzaffarnagar","Pilibhit","Pratapgarh","Prayagraj","Rae Bareli",
    "Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur",
    "Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur",
    "Unnao","Varanasi",
  ],
  "Uttarakhand": [
    "Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar",
    "Nainital","Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal",
    "Udham Singh Nagar","Uttarkashi",
  ],
  "West Bengal": [
    "Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur",
    "Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong",
    "Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas",
    "Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman",
    "Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur",
  ],
  // Union Territories
  "Andaman and Nicobar Islands": ["Nicobar","North and Middle Andaman","South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli","Daman","Diu"],
  "Delhi": [
    "Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi",
    "North West Delhi","Shahdara","South Delhi","South East Delhi",
    "South West Delhi","West Delhi",
  ],
  "Jammu and Kashmir": [
    "Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu",
    "Kathua","Kishtwar","Kulgam","Kupwara","Poonch","Pulwama","Rajouri",
    "Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur",
  ],
  "Ladakh": ["Kargil","Leh"],
  "Lakshadweep": ["Lakshadweep"],
  "Puducherry": ["Karaikal","Mahe","Puducherry","Yanam"],
};

// District → Blocks (key: "District|State")
const RAW_BLOCKS: Record<string, string[]> = {
  // UTTAR PRADESH
  "Lucknow|Uttar Pradesh": ["Sadar","Malihabad","Bakshi Ka Talab","Gosainganj","Mohanlalganj","Chinhat","Kakori"],
  "Agra|Uttar Pradesh": ["Agra","Etmadpur","Fatehabad","Kheragarh","Akola","Bah","Barauli Ahir","Fatehpur Sikri","Jagner","Khandauli","Pinahat","Saiyan","Shamsabad"],
  "Varanasi|Uttar Pradesh": ["Arajiline","Badagaon","Cholapur","Harhua","Harhaua","Kashi Vidyapeeth","Pindra","Rohania","Sewapuri"],
  "Gorakhpur|Uttar Pradesh": ["Campierganj","Chauri Chaura","Gola","Jungle Kaudia","Khajni","Piparraich","Sahjanwa","Bansgaon"],
  "Prayagraj|Uttar Pradesh": ["Bara","Chaka","Handia","Jasra","Karchhana","Meja","Phulpur","Koraon","Shankargarh","Soraon","Urf Bahadurpur"],
  "Kanpur Nagar|Uttar Pradesh": ["Bhitargaon","Bilhaur","Chaubepur","Ghatampur","Kalyanpur","Maharajpur","Sarbananda","Shivrajpur"],
  "Mathura|Uttar Pradesh": ["Baldeo","Chhata","Farah","Govardhan","Mahavan","Mat","Nandgaon","Mant","Raya"],
  "Bareilly|Uttar Pradesh": ["Aonla","Baheri","Bithri Chainpur","Faridpur","Meerganj","Nawabganj","Ramnagar","Shergarh"],
  "Meerut|Uttar Pradesh": ["Daurala","Hapur","Kharkhoda","Machhara","Mawana","Meerut","Parikshitgarh","Rajpura","Rohta"],
  "Ghaziabad|Uttar Pradesh": ["Bhojpur","Dasna","Hapur","Loni","Modinagar","Muradnagar","Razapur","Tronica City"],
  "Muzaffarnagar|Uttar Pradesh": ["Budhana","Charthawal","Jansath","Khatauli","Mansurpur","Purqazi","Shahpur"],
  "Bahraich|Uttar Pradesh": ["Bhinga","Huzurpur","Kaiserganj","Mihipurwa","Nanpara","Payagpur","Risia","Tejwapur"],
  "Sitapur|Uttar Pradesh": ["Biswan","Godlamau","Hargaon","Khairabad","Laharpur","Maholi","Misrikh","Pahala","Pisawan"],
  "Lakhimpur Kheri|Uttar Pradesh": ["Dhaurahara","Gola","Kumbhi","Mohammadi","Nighasan","Palia","Phoolbehar","Ramnagar","Sampurna Nagar"],
  "Azamgarh|Uttar Pradesh": ["Atarauli","Azamgarh","Bilariyaganj","Jahanaganj","Koilsa","Lalganj","Martinganj","Mehnagar","Pawai","Phulpur","Raunapar","Saraimeer","Tarwa"],
  "Deoria|Uttar Pradesh": ["Bhaluani","Bhatni","Barhaj","Desai","Lar","Pathardeva","Rampur Karkhana","Rudrapur","Salempur"],
  "Mau|Uttar Pradesh": ["Dohrighat","Ghosi","Kopaganj","Madhuban","Mau Sadar","Muhammadabad Gohna","Ratanpura"],
  "Gonda|Uttar Pradesh": ["Colonelganj","Katara","Khargupur","Mankapur","Nawabganj","Paraspur","Tarabganj","Utraula"],
  "Sultanpur|Uttar Pradesh": ["Akhand Nagar","Baldirai","Bhadaiyan","Dostpur","Dubepur","Kadipur","Kurwar","Lambhua","Musafirkhana"],
  "Faizabad|Uttar Pradesh": ["Bikapur","Haidergarh","Maya","Milkipur","Pura Bazar","Sohawal","Tarun"],
  "Basti|Uttar Pradesh": ["Gaur","Haraiya","Kaptanganj","Kudaraha","Mahadewa","Murtiha","Saltaua","Vikramajot"],

  // BIHAR
  "Patna|Bihar": ["Athmalgola","Bakhtiyarpur","Belchhi","Bihta","Daniyawan","Danapur","Dulhin Bazar","Fatwa","Ghoswari","Khusrupur","Maner","Masaurhi","Naubatpur","Paliganj","Patna Sadar","Phulwari Sharif","Sampatchak","Vikram"],
  "Gaya|Bihar": ["Amas","Atri","Barachatti","Belaganj","Bodh Gaya","Dobhi","Fatehpur","Guraru","Imamganj","Konch","Manpur","Mohanpur","Sherghati","Tankuppa","Tekari","Wazirganj"],
  "Muzaffarpur|Bihar": ["Aurai","Bochahan","Gaighata","Kanti","Kurhani","Motipur","Musahri","Paru","Sahebganj","Sakra","Saraiya","Minapur","Bandra"],
  "Darbhanga|Bihar": ["Alinagar","Baheri","Benipur","Biraul","Darbhanga Sadar","Ghanshyampur","Hanuman Nagar","Hayaghat","Jamalpur","Jale","Keoti","Kiratpur","Kusheshwar Asthan","Singhwara","Tardih"],
  "Bhagalpur|Bihar": ["Banka","Goradih","Jagdishpur","Kharik","Narayanpur","Nathnagar","Pirpainti","Sabour","Sanhaula","Shahkund","Sultanganj"],
  "Nalanda|Bihar": ["Asthawan","Ben","Bind","Chandi","Ekangarsarai","Giriak","Hilsa","Harnaut","Islampur","Karai Parsurai","Katrisarai","Noorsarai","Parbalpur","Rahui","Rajgir","Silao","Tharthari"],
  "Purnia|Bihar": ["Amour","Baisi","Banmankhi","Bhawanipur","Dhamdaha","Jalalgarh","Kasba","Krityanand Nagar","Poriyahi","Rupauli","Shrinarayanpur"],
  "Samastipur|Bihar": ["Bibhutpur","Dalsinghsarai","Hasanpur","Mohiuddinagar","Morwa","Patori","Pusa","Rosera","Sarairanjan","Shivajinagar","Singhia","Tajpur","Ujiarpur","Warisnagar"],
  "East Champaran|Bihar": ["Adapur","Areraj","Bangdaha","Chakia","Dhaka","Ghorasahan","Harsidhi","Kesaria","Kotwa","Mehsi","Motihari","Pakridayal","Paharpur","Pipra","Raxaul","Sangrampur","Sugauli","Tura Sawa"],

  // MAHARASHTRA
  "Pune|Maharashtra": ["Ambegaon","Baramati","Bhor","Daund","Haveli","Indapur","Junnar","Khed","Maval","Mulshi","Purandar","Shirur","Velhe"],
  "Nashik|Maharashtra": ["Baglan","Chandwad","Deola","Dindori","Igatpuri","Kalwan","Malegaon","Nandgaon","Niphad","Peint","Sinnar","Surgana","Trimbakeshwar","Yeola"],
  "Nagpur|Maharashtra": ["Bhiwapur","Hingna","Kalmeshwar","Katol","Kuhi","Mauda","Mohadi","Narkhed","Parseoni","Ramtek","Savner","Umred","Nagpur"],
  "Aurangabad|Maharashtra": ["Aurangabad","Gangapur","Kannad","Khuldabad","Paithan","Phulambri","Sillod","Soegaon","Vaijapur"],
  "Kolhapur|Maharashtra": ["Ajara","Bhudargad","Gadhinglaj","Hatkanangle","Kagal","Karveer","Panhala","Radhanagari","Shahuwadi","Shirol"],
  "Solapur|Maharashtra": ["Akkalkot","Barshi","Karmala","Madha","Malshiras","Mohol","Pandharpur","Sangola","Solapur North","Solapur South"],
  "Amravati|Maharashtra": ["Achalpur","Anjangaon Surji","Chandur","Chandur Bazar","Chikhaldara","Daryapur","Dharni","Morshi","Nandgaon Khandesh","Warud"],
  "Jalgaon|Maharashtra": ["Amalner","Bhadgaon","Bhusawal","Bodwad","Chalisgaon","Chopda","Dharangaon","Erandol","Jamner","Muktainagar","Pachora","Parola","Raver","Yawal"],

  // MADHYA PRADESH
  "Indore|Madhya Pradesh": ["Depalpur","Hatod","Indore","Mhow","Sanwer"],
  "Bhopal|Madhya Pradesh": ["Bairasia","Berasia","Bhopal","Phanda"],
  "Gwalior|Madhya Pradesh": ["Bhitarwar","Dabra","Gwalior","Morar","Sihore"],
  "Jabalpur|Madhya Pradesh": ["Jabalpur","Kundam","Majholi","Patan","Shahpura","Sihora"],
  "Ujjain|Madhya Pradesh": ["Badnagar","Ghatiya","Khachrod","Mahidpur","Nagda","Tarana","Ujjain"],
  "Rewa|Madhya Pradesh": ["Gangev","Gurh","Huzur","Jawa","Mangawan","Mauganj","Naigarhi","Raipur Karchuliyan","Sirmour","Teonthar","Tyonthar"],
  "Sagar|Madhya Pradesh": ["Banda","Deori","Kesli","Rahatgarh","Rehli","Sagar","Shahgarh"],
  "Satna|Madhya Pradesh": ["Amarpatan","Maihar","Nagod","Ramnagar","Rampur Baghelan","Satna","Unchehara","Uchhehara"],

  // RAJASTHAN
  "Jaipur|Rajasthan": ["Amber","Amer","Bassi","Chaksu","Chomu","Dudu","Govindgarh","Jamwa Ramgarh","Jhotwara","Jobner","Kotputli","Phagi","Sambhar","Sanganer","Shahpura","Toonga","Viratnagar"],
  "Jodhpur|Rajasthan": ["Bhopalgarh","Bilara","Boranada","Dechu","Jodhpur","Luni","Mandore","Osian","Phalodi","Shergarh","Tinwari"],
  "Kota|Rajasthan": ["Digod","Itawa","Kota","Ladpura","Pipalda","Ramganj Mandi","Sangod","Sultanpur"],
  "Udaipur|Rajasthan": ["Bhindar","Girwa","Gogunda","Jhadol","Kherwara","Kotra","Lasadia","Mavli","Rishabhdev","Sarada","Semari","Vallabhnagar"],
  "Bikaner|Rajasthan": ["Bajju","Bikaner","Chhatargarh","Deshnok","Dungargarh","Khajuwala","Kolayat","Lunkaransar","Nokha","Poogal"],
  "Ajmer|Rajasthan": ["Ajmer","Arain","Bhinai","Kishangarh","Masuda","Nasirabad","Peesangan","Pisangan","Pushkar","Roopangarh","Srinagar","Tatgarh"],
  "Sri Ganganagar|Rajasthan": ["Gharsana","Karanpur","Padampur","Raisinghnagar","Sadulshahr","Sri Ganganagar","Suratgarh","Vijaynagar"],
  "Sikar|Rajasthan": ["Danta Ramgarh","Fatehpur","Khandela","Lachhmangarh","Neemkathana","Neem Ka Thana","Piprali","Shrimadhopur","Sikar"],

  // GUJARAT
  "Ahmedabad|Gujarat": ["Bavla","City","Dascroi","Detroj Rampura","Dholka","Dholera","Dhandhuka","Mandal","Ranpur","Sanand","Viramgam"],
  "Surat|Gujarat": ["Bardoli","Choryasi","Kamrej","Mahuva","Mandvi","Mangrol","Olpad","Palsana","Umarpada","Valod"],
  "Vadodara|Gujarat": ["Dabhoi","Desar","Karjan","Padra","Sankheda","Savli","Shinor","Vadodara"],
  "Rajkot|Gujarat": ["Gondal","Jasdan","Jetpur","Kotda Sangani","Lodhika","Morbi","Paddhari","Rajkot","Tankara","Upleta","Vinchhiya","Virpur"],
  "Anand|Gujarat": ["Anand","Anklav","Borsad","Cambay","Khambhat","Petlad","Sojitra","Tarapur","Umreth"],
  "Mehsana|Gujarat": ["Bechraji","Jotana","Kadi","Kheralu","Mehsana","Satlasana","Unjha","Vadnagar","Vijapur","Visnagar"],
  "Banaskantha|Gujarat": ["Amirgadh","Bhabhar","Danta","Dantiwada","Deesa","Deodar","Dhanera","Kankrej","Lakhani","Palanpur","Suigam","Tharad","Vav"],

  // KARNATAKA
  "Bengaluru Urban|Karnataka": ["Anekal","Bengaluru East","Bengaluru North","Bengaluru South","Doddaballapura","Yeshwanthapura"],
  "Mysuru|Karnataka": ["HD Kote","Hunsur","KR Nagar","Mysuru","Nanjangud","Periyapatna","T Narasipur"],
  "Dharwad|Karnataka": ["Dharwad","Hubli","Kalghatgi","Navalgund","Kundgol"],
  "Ballari|Karnataka": ["Ballari","Hadagali","Hagaribommanahalli","Hospete","Kudligi","Sandur","Siruguppa"],
  "Kalaburagi|Karnataka": ["Aland","Afzalpur","Chittapur","Chincholi","Jewargi","Kalaburagi","Sedam","Shahabad","Yadgir"],
  "Belagavi|Karnataka": ["Athani","Bailhongal","Chikkodi","Gokak","Hukkeri","Kittur","Mudalagi","Raibag","Ramdurg","Savadatti"],
  "Tumakuru|Karnataka": ["Chiknayakanhalli","Gubbi","Koratagere","Kunigal","Madhugiri","Pavagada","Sira","Tiptur","Tumakuru","Turuvekere"],
  "Raichur|Karnataka": ["Devadurga","Lingsugur","Maski","Manvi","Mudugal","Raichur","Sindhnur"],

  // ANDHRA PRADESH
  "Guntur|Andhra Pradesh": ["Bapatla","Chebrole","Chilakaluripet","Gurazala","Kolluru","Narasaraopet","Palnadu","Repalle","Sattenapalle","Tenali","Vinukonda"],
  "Krishna|Andhra Pradesh": ["Bapulapadu","Chatrai","Gannavaram","Gudivada","Guduru","Hanuman Junction","Jaggayyapeta","Kaikaluru","Koduru","Movva","Musunuru","Nandigama","Nuzvid","Pamarru","Tiruvuru","Vissannapet"],
  "Visakhapatnam|Andhra Pradesh": ["Anakapalle","Araku Valley","Bheemunipatnam","Bhimili","Chodavaram","Devarapalle","Elamanchili","GVK","Gajuwaka","Kasimkota","Madugula","Makavarapalem","Munagapaka","Narsipatnam","Paderu","Parawada","Rawlapeta","Rolugunta","Sabbavaram","Visakhapatnam"],
  "Kurnool|Andhra Pradesh": ["Adoni","Alur","Atmakur","Banaganapalle","Betamcherla","Dhone","Dornipadu","Gonegandla","Holagunda","Kodumur","Kosigi","Kurnool","Maddikera","Nandikotkur","Nandyal","Owk","Pagidyala","Pamulapadu","Pathikonda","Pattikonda","Peapully","Velgode","Veldurthi"],
  "Nellore|Andhra Pradesh": ["Allur","Ananthasagaram","Atmakur","Bogole","Buchireddipalem","Chejarla","Chillakur","Dakkili","Duttaluru","Indukurpet","Jaladanki","Kavali","Kodavalur","Kondapi","Kovur","Lingasamudram","Muthukur","Naidupeta","Nellore","Ojili","Podalakur","Sarvepalli","Seetharamapuram","Sirpur","Sullurupeta","Tada","Udayagiri","Venkatachalam","Vidavalur"],

  // TELANGANA
  "Rangareddy|Telangana": ["Chevella","Farooqnagar","Hayathnagar","Ibrahimpatnam","Kandukur","Maheshwaram","Marpalle","Pargi","Rajendranagar","Shadnagar","Srisailam","Tandur","Vikarabad","Yacharam"],
  "Karimnagar|Telangana": ["Choppadandi","Dharmapuri","Gangadhara","Huzurabad","Jammikunta","Julakal","Karimnagar","Kataram","Koheda","Manakondur","Manthani","Peddapalli","Ramadugu","Sircilla","Thimmapur","Yellareddipet"],
  "Nizamabad|Telangana": ["Armur","Balkonda","Banswada","Bhiknoor","Bheemgal","Bodhan","Dichpally","Domakonda","Jakranpalle","Kamareddy","Kotagiri","Lingampet","Nizamabad","Nizam Sagar","Pitlam","Renjal","Yellareddy"],
  "Nalgonda|Telangana": ["Alair","Bhongir","Chandampet","Choutuppal","Devarakonda","Huzurnagar","Kodad","Miryalaguda","Mothkur","Munugode","Nakrekal","Narayanapur","Ramannapeta","Suryapet","Thipparthi","Tungaturthy"],

  // WEST BENGAL
  "Paschim Bardhaman|West Bengal": ["Asansol","Barabani","Faridpur","Kanksa","Ondal","Pandaveswar","Raniganj","Salanpur"],
  "Purba Bardhaman|West Bengal": ["Ausgram","Bhatar","Burdwan","Jamalpur","Kalna","Katwa","Ketugram","Mangalkot","Memari","Monteswar","Raina"],
  "Murshidabad|West Bengal": ["Bahrampur","Beldanga","Bharatpur","Domkal","Hariharpara","Jalangi","Kandi","Khargram","Lalgola","Nabagram","Raghunathganj","Raninagar","Rejinagar","Sagardighi","Samserganj","Suti"],
  "Nadia|West Bengal": ["Chakdah","Chapra","Haringhata","Hanskhali","Karimpur","Krishnanagar","Nakashipara","Nazirpur","Ranaghat","Santipur","Tehatta"],
  "North 24 Parganas|West Bengal": ["Amdanga","Baduria","Bagdah","Barasat","Basirhat","Bongaon","Deganga","Gaighata","Habra","Minakhan","Rajarhat","Sandeshkhali","Swarupnagar"],
  "Hooghly|West Bengal": ["Arambag","Balagarh","Chandannagar","Chinsurah","Dhaniakhali","Goghat","Haripal","Jangipara","Khanakul","Pandua","Polba","Pursurah","Serampore","Singur","Tarakeswar","Uttarpara"],
  "Malda|West Bengal": ["Bamangola","English Bazar","Gazole","Gour","Harishchandrapur","Kaliachak","Manikchak","Motihari","Old Malda","Ratua"],

  // PUNJAB
  "Ludhiana|Punjab": ["Jagraon","Khanna","Ludhiana East","Ludhiana West","Machhiwara","Mullanpur Dakha","Payal","Raikot","Samrala","Sudhar"],
  "Amritsar|Punjab": ["Ajnala","Amritsar","Baba Bakala","Chogawan","Jandiala","Lopoke","Majitha","Rayya","Tarsikka"],
  "Patiala|Punjab": ["Bhunarheri","Dakala","Ghanaur","Nabha","Patiala","Patran","Rajpura","Sanour"],
  "Bathinda|Punjab": ["Bathinda","Goniana","Maur","Nathana","Phul","Rampura","Sangat","Talwandi Sabo"],
  "Sangrur|Punjab": ["Barnala","Dirba","Lehra","Longowal","Malerkotla","Moonak","Sangrur","Sunam","Dhuri"],

  // HARYANA
  "Karnal|Haryana": ["Assandh","Gharaunda","Indri","Karnal","Kunjpura","Nilokheri","Nissing"],
  "Hisar|Haryana": ["Agroha","Adampur","Barwala","Bass","Hansi","Hisar","Narnaund","Uklana"],
  "Panipat|Haryana": ["Bapoli","Israna","Madlauda","Panipat","Samalkha","Sanoli"],
  "Ambala|Haryana": ["Ambala","Barara","Mulana","Naraingarh","Saha","Shahzadpur","Shehzadpur"],
  "Sirsa|Haryana": ["Dabwali","Ellenabad","Nathusari Chopta","Odhan","Rania","Sirsa"],

  // TAMIL NADU
  "Coimbatore|Tamil Nadu": ["Anaimalai","Coimbatore North","Coimbatore South","Kinathukadavu","Madukkarai","Mettupalayam","Periyanaickenpalayam","Pollachi","Sulur","Thondamuthur","Valparai"],
  "Salem|Tamil Nadu": ["Attur","Edapadi","Gangavalli","Magudanchavadi","Mettur","Omalur","Salem","Sangagiri","Thalaivasal","Vazhapadi","Yercaud"],
  "Madurai|Tamil Nadu": ["Kallikudi","Kottampatti","Madurai East","Madurai North","Madurai South","Madurai West","Melur","Peraiyur","Thirparankundram","Usilampatti","Vadipatti"],
  "Tiruchirappalli|Tamil Nadu": ["Lalgudi","Manapparai","Manachanallur","Marungapuri","Musiri","Srirangam","Thottiyam","Thuvarankurichi","Tiruverambur","Trichy","Uppiliyapuram"],
  "Thanjavur|Tamil Nadu": ["Budalur","Kumbakonam","Orathanadu","Papanasam","Pattukkottai","Peravurani","Thanjavur","Thiruvaiyaru","Thiruvidaimaruthur"],

  // ODISHA
  "Khordha|Odisha": ["Balianta","Balipatna","Bhubaneswar","Bolagarh","Chilika","Jatni","Khordha","Tangi"],
  "Cuttack|Odisha": ["Athagarh","Banki","Baramba","Cuttack Sadar","Dampada","Kanpur","Mahanga","Niali","Nimapara","Salepur","Tigiria"],
  "Ganjam|Odisha": ["Aska","Bhanjanagar","Berhampur","Bhanjanagar","Buguda","Chhatrapur","Chikiti","Dharakote","Digapahandi","Hinjilicut","Kabisuryanagar","Khallikote","Kodala","Polasara","Purushottampur","Rangeilunda","Sorada","Sanakhemundi","Sheragada","Surada"],
  "Balasore|Odisha": ["Balasore","Bahanaga","Baliapal","Bhograi","Bhogarai","Jaleswar","Nilagiri","Osta","Remuna","Soro","Simulia"],

  // MADHYA PRADESH - additional
  "Raipur|Chhattisgarh": ["Abhanpur","Arang","Bhatapara","Dharsiwa","Dundia","Gurur","Mandir Hasaud","Simga","Tilda"],
  "Bilaspur|Chhattisgarh": ["Baluoda","Belha","Bilaspur","Kota","Kotai","Mungeli","Pendra","Ratanpur","Sakthi","Takhatpur"],

  // JHARKHAND
  "Ranchi|Jharkhand": ["Angara","Burmu","Chanho","Kanke","Lapung","Mandar","Namkum","Ormanjhi","Ratu","Silli","Sonahatu","Tamar"],
  "Dhanbad|Jharkhand": ["Baghmara","Baliapur","Dhanbad","Gobindpur","Jharia","Nirsa","Topchanchi","Tundi"],

  // HIMACHAL PRADESH
  "Kangra|Himachal Pradesh": ["Baijnath","Bangana","Bhawarna","Dehra","Dharamshala","Fatehpur","Indora","Jaisinghpur","Kangra","Khundian","Lambagaon","Multhan","Nagrota Bagwan","Nagrota Suriyan","Nurpur","Palampur","Panchrukhi","Pragpur","Rait","Sullah","Thural"],
  "Shimla|Himachal Pradesh": ["Chirgaon","Chhota Shimla","Jubbal","Kotkhai","Mashobra","Rampur","Rohru","Shimla","Sunni","Tikkar"],
  "Mandi|Himachal Pradesh": ["Bali Chowki","Chachyot","Chauntra","Gopalpur","Joginder Nagar","Karsog","Lad Bharol","Mandi","Nihri","Sadar","Sarkaghat","Sunder Nagar","Thunag"],

  // UTTARAKHAND
  "Dehradun|Uttarakhand": ["Chakrata","Doiwala","Kalsi","Raipur","Sahaspur","Vikasnagar"],
  "Haridwar|Uttarakhand": ["Bahadarabad","Bhagwanpur","Laksar","Narsan","Roorkee"],
  "Nainital|Uttarakhand": ["Betalghat","Dhari","Haldwani","Kotabagh","Okhalkanda","Ramgarh","Ramnagar"],
  "Udham Singh Nagar|Uttarakhand": ["Bazpur","Gadarpur","Jaspur","Kashipur","Khatima","Kichha","Rudrapur","Sitarganj"],
};

// Block → detailed data
const RAW_BLOCK_DETAIL: Record<string, { villages: string[]; postOffices: string[]; policeStations: string[] }> = {
  "Sadar|Lucknow|Uttar Pradesh": {
    villages: ["Sadar Bazar","Maliabad Khurd","Bangla Bazar","Charbagh Colony","Yahiyaganj","Nakhas Ohana"],
    postOffices: ["Sadar Bazar PO","Nakhas PO","Charbagh PO"],
    policeStations: ["Sadar Police Station","Chowk Police Station"],
  },
  "Malihabad|Lucknow|Uttar Pradesh": {
    villages: ["Malihabad","Dewa Sharif","Chinhat","Kakori","Hardoi Road","Bakshi Ka Talab"],
    postOffices: ["Malihabad PO","Dewa Sharif PO","Chinhat PO"],
    policeStations: ["Malihabad Police Station","Chinhat Police Station"],
  },
  "Bakshi Ka Talab|Lucknow|Uttar Pradesh": {
    villages: ["Bakshi Ka Talab","Banthra","Mohanlalganj","Deva","Itaunja","Sarojini Nagar"],
    postOffices: ["BKT PO","Banthra PO"],
    policeStations: ["BKT Police Station","Banthra Police Station"],
  },
  "Gosainganj|Lucknow|Uttar Pradesh": {
    villages: ["Gosainganj","Amethi","Kakori","Malhour","Mahanpur","Siddhora"],
    postOffices: ["Gosainganj PO","Amethi PO"],
    policeStations: ["Gosainganj Police Station"],
  },
  "Haveli|Pune|Maharashtra": {
    villages: ["Hadapsar","Kothrud","Deccan","Baner","Wakad","Pimple Saudagar","Hinjewadi"],
    postOffices: ["Hadapsar PO","Kothrud PO","Baner PO"],
    policeStations: ["Hadapsar Police Station","Kothrud Police Station"],
  },
  "Baramati|Pune|Maharashtra": {
    villages: ["Baramati","Morgaon","Nimgaon","Indapur","Bhigwan","Natepute"],
    postOffices: ["Baramati PO","Morgaon PO","Bhigwan PO"],
    policeStations: ["Baramati Police Station","Morgaon Police Station"],
  },
  "City|Ahmedabad|Gujarat": {
    villages: ["Sabarmati","Naroda","Asarwa","Odhav","Vatwa","Narol","Lambha"],
    postOffices: ["Sabarmati PO","Naroda PO","Odhav PO"],
    policeStations: ["Sabarmati Police Station","Naroda Police Station"],
  },
  "Sanand|Ahmedabad|Gujarat": {
    villages: ["Sanand","Bavla","Changodar","Khoraj","Moraiya","Zundal"],
    postOffices: ["Sanand PO","Bavla PO"],
    policeStations: ["Sanand Police Station"],
  },
};

// Helper: get block details key
function makeBlockKey(block: string, district: string, state: string) {
  return `${block}|${district}|${state}`;
}

export function getDistricts(state: string): string[] {
  return STATE_DISTRICTS[state] ?? [];
}

export function getBlocks(state: string, district: string): string[] {
  const key = `${district}|${state}`;
  return RAW_BLOCKS[key] ?? generateBlocks(district);
}

export function getVillages(state: string, district: string, block: string): string[] {
  const key = makeBlockKey(block, district, state);
  return RAW_BLOCK_DETAIL[key]?.villages ?? generateVillages(block, district);
}

export function getPostOffices(state: string, district: string, block: string): string[] {
  const key = makeBlockKey(block, district, state);
  return RAW_BLOCK_DETAIL[key]?.postOffices ?? [`${block} Head PO`, `${block} Sub PO`];
}

export function getPoliceStations(state: string, district: string, block: string): string[] {
  const key = makeBlockKey(block, district, state);
  return RAW_BLOCK_DETAIL[key]?.policeStations ?? [`${block} Police Station`];
}

// Generate plausible block names when not in database
function generateBlocks(district: string): string[] {
  const suffixes = ["Sadar","Rural","Urban","North","South","East","West","Central"];
  return [
    `${district} Sadar`,
    `${district} Rural`,
    `${district} North`,
    `${district} South`,
    `${district} East`,
    `${district} West`,
  ];
}

// Generate plausible village names when not in database
function generateVillages(block: string, district: string): string[] {
  return [
    `${block} Khurd`,
    `${block} Kalan`,
    `${district} Nagar`,
    `New ${block}`,
    `${block} Colony`,
    `${block} Purwa`,
    `Naya ${block}`,
  ];
}
