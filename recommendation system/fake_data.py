import pandas as pd
import numpy as np
from datetime import date, timedelta, datetime
import random
from faker import Faker
from gender_guesser.detector import Detector
import string

#  ------------------- FAKE USER DATA GENERATION -----------------------------------

def calculate_age(birth_date):
    today = date.today()
    age = today.year - birth_date.year

    # Check if birthday has not occurred yet this year
    if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
        age -= 1

    return age

def generate_false_true(prob_false=0.8):
    if random.random() < prob_false:
        return False
    else:
        return True
    
def generate_username(name):
    return name.replace(" ", "_").replace(".", "_").lower()
    

def generate_password(length=10):
    letters = string.ascii_letters
    digits = string.digits

    password = random.choice(letters.upper())  # Ensure at least one uppercase letter
    password += random.choice(digits)  # Ensure at least one number
    password += ''.join(random.choice(letters + digits) for _ in range(length - 2))

    password = ''.join(random.sample(password, len(password)))  # Shuffle the password

    return password

def generate_fake_users(n):
    # Create an instance of the Faker class
    fake = Faker()
    # Create an instance of the Detector class
    detector = Detector()

    fake_data = []
    for id in range(n):

        record = {'id': id, 'password': generate_password(), 'name': fake.name(), 'birthdate': fake.date_of_birth(minimum_age=14, maximum_age=90) , 'city': fake.city(), 'trainer': generate_false_true() }
        record['gender'] = detector.get_gender(record['name'].split(' ')[0])
        record['age'] = calculate_age(record['birthdate'])
        # If name is not clear if it is feminine or masculin, then set it to 'Prefer not to say'.
        record['username'] = generate_username(record['name'])
        if record['gender'] != 'male' and record['gender'] != 'female':
            record['gender'] = 'Prefer not to say'
        fake_data.append(record)

    return pd.DataFrame(fake_data)


def get_username_by_id(users, user_id):
    username = users.loc[users['id'] == user_id, 'username'].values[0]
    return username


#  ------------------- FAKE CLASS DATA GENERATION -----------------------------------

# Create a custom provider for fitness disciplines
class FitnessProvider:
    def __init__(self, faker):
        self.faker = faker

    def fitness_discipline(self):
        disciplines = [
            'Yoga',
            'Pilates',
            'CrossFit',
            'Zumba',
            'Kickboxing',
            'Spinning',
            'Barre',
            'HIIT',
            'Aerobics',
            'Boxing',
            'Personalized',
            'Body Combat',
            'Body Pump',
            'GAP',
            'Total Body Conditioning',
            'ABS',
            'Stretching',
            'Other'
        ]
    
        return self.faker.random_element(disciplines)
    def description(key):
        descriptions = {
            'Yoga': "Discover inner peace and enhance your physical and mental well-being with our invigorating yoga classes. Unwind, increase flexibility, and strengthen your body while finding balance and harmony in a serene environment.",
            'Pilates': "Sculpt your body and improve your posture with our dynamic Pilates sessions. Strengthen your core, tone your muscles, and increase flexibility while engaging in precise movements that promote body awareness and grace.",
            'CrossFit': "Unleash your inner athlete with our high-intensity CrossFit classes. Push your limits, increase strength and endurance, and experience the camaraderie of a supportive community as you tackle challenging workouts designed to optimize your fitness.",
            'Zumba': "Join the dance party and get your heart pumping with our exhilarating Zumba classes. Burn calories, boost your energy, and let loose to infectious Latin and international rhythms that make exercising feel like a celebration.",
            'Kickboxing': "Release stress and get a full-body workout with our empowering kickboxing classes. Learn striking techniques, improve your coordination, and build strength while unleashing your inner warrior in a fun and supportive environment.",
            'Spinning': "Pedal your way to a healthier you with our energizing spinning classes. Get your heart racing, strengthen your legs, and burn calories as you ride to the rhythm of motivating music in a dynamic and immersive indoor cycling experience.",
            'Barre': "Achieve a graceful and sculpted physique with our ballet-inspired barre classes. Combine elements of dance, Pilates, and strength training to tone your muscles, improve flexibility, and embrace your inner ballerina.",
            'HIIT': "Get ready to torch calories and boost your metabolism with our heart-pumping HIIT sessions. Alternate between intense bursts of exercise and short recovery periods to maximize fat burning and achieve fast results.",
            'Aerobics': "Join the fun and get your heart pumping with our vibrant aerobics classes. Move to energizing music, improve cardiovascular fitness, and enhance coordination while enjoying a lively and engaging workout.",
            'Boxing': "Unleash your inner fighter and improve your strength and agility with our empowering boxing classes. Learn proper boxing techniques, increase endurance, and build confidence while working up a sweat and relieving stress.",
            'Personalized': "Experience the ultimate tailored fitness program with our personalized classes. Our expert trainers will design a workout plan specifically for you, taking into account your goals, fitness level, and preferences to ensure optimal results and motivation.",
            'Body Combat': "Channel your energy and release stress with our dynamic body combat classes. Combine martial arts-inspired moves with cardiovascular exercises to improve strength, coordination, and cardiovascular fitness in a challenging and empowering session.",
            'Body Pump': "Sculpt and define your muscles with our invigorating body pump classes. Using barbells and adjustable weights, you'll perform a series of strength-training exercises to target all major muscle groups, leaving you feeling strong and confident.",
            'GAP': "Focus on your lower body and core strength with our targeted GAP classes. Tone and tighten your glutes, abs, and legs through a combination of exercises designed to help you achieve a firm and toned physique.",
            'Total Body Conditioning': "Transform your body from head to toe with our comprehensive total body conditioning classes. Combining strength, cardio, and flexibility exercises, you'll enjoy a complete workout that targets all muscle groups for improved fitness and body composition.",
            'ABS': "Sculpt a strong and defined core with our dedicated ABS classes. Through a variety of exercises specifically targeting your abdominal muscles, you'll work towards achieving a toned midsection and improved stability.",
            'Stretching': "Enhance your flexibility, improve posture, and prevent injuries with our rejuvenating stretching classes. Release tension, increase range of motion, and promote muscle recovery while experiencing deep relaxation and stress relief.",
            'Other': "Embark on a journey of exploration and variety with our diverse range of specialized fitness classes. From aerial yoga to functional training, we offer unique opportunities to challenge yourself, discover new passions, and uncover hidden talents. Step outside your comfort zone"
        }
        return descriptions[key]

    def level(self):
        levels = ['begginer', 'intermediate', 'advanced', 'all levels']
        return self.faker.random_element(levels)

def trainers_ids(users_df):
    trainers = users_df[users_df['trainer'] == True]
    return trainers['id'].values

def approximate_datetime(dt):
    # Calculate the number of minutes past the hour
    minutes_past_hour = dt.minute + dt.second / 60

    # Determine the rounding factor based on the number of minutes past the hour
    rounding_factor = 30 if minutes_past_hour >= 30 else 0

    # Calculate the rounded datetime
    rounded_dt = dt.replace(minute=0, second=0) + timedelta(minutes=rounding_factor)

    return rounded_dt

def generate_fake_classes(first_id, n, users_df, new):
    # Create an instance of the Faker class
    fake = Faker()

    # Add the custom provider to the Faker instance
    fake.add_provider(FitnessProvider)

    classes = []
    mean_price = 15
    var_price = 3


    today = datetime.now()
    approx_today =  approximate_datetime(today)
  
    

    possible_durations_h = [0,1,2]
    possible_durations_min = [i for i in range(0,60,5)]

    for id in range(first_id, n):
        price = np.random.normal(mean_price, var_price, 1)[0]
        price = round(price,2)
       
        record = {'id': id, 'category': fake.fitness_discipline(), 'creator_id': random.choice(trainers_ids(users_df)) ,
                'level':fake.level(), 'maxUsers': random.randint(1, 50), 'price': price}
        record['title'] = 'A ' + record['category'] + ' class'
        duration_h = random.choice(possible_durations_h)
        duration = str(duration_h) + ' h '
        if(duration_h != 2):
            duration_min = random.choice(possible_durations_min)
            if(duration_min != 0):
                duration +=  str(duration_min) + ' min'
                
        record['duration'] = duration
        random_days = random.randint(1, 365)
        # Generate a random number of 30-minute intervals
        random_intervals = random.randint(0, 48)  # 48 intervals in a day (24 hours * 2 intervals per hour) 

        if(new):
            record['datetime'] =  approx_today + timedelta(days=random_days, minutes=30 * random_intervals)
        else:
            record['datetime'] =  approx_today - timedelta(days=random_days, minutes=30 * random_intervals)

        record['creator'] = get_username_by_id(users_df, record['creator_id'])
        record['description'] = FitnessProvider.description(record['category'])

        classes.append(record)

    return pd.DataFrame(classes)

def generate_fake_ratings(num_users, num_classes):
    fake = Faker()
    data = []
    for user_id in range(num_users):  
        for _ in range(num_classes):  
            course_id = fake.random_int(min=0, max=num_classes-1)  # Generate a random course ID
            is_nan = random.random()
            # Create sparsity
            if is_nan <= 0.95:
                rating = np.nan
            else:
                rating = random.randint(1,5) # Generate a random rating

            data.append({'User ID': user_id, 'Course ID': course_id, 'Rating': rating})
    # Create DataFrame with generated data
    df = pd.DataFrame(data)
    # Create ratings matrix with sparsity
    return df.pivot_table(values='Rating', index='User ID', columns='Course ID')

def export_dataframe(df, filename):
    path = 'fake_data\\' + filename
    df.to_csv(path +'.csv', index=False)

NUM_USERS = 1000
NUM_CLASSES = 1000
users = generate_fake_users(NUM_USERS)
past_classes = generate_fake_classes(0, NUM_CLASSES, users, False)
future_classes = generate_fake_classes(NUM_CLASSES, 2*NUM_CLASSES, users, True)

ratings_matrix = generate_fake_ratings(NUM_USERS,NUM_CLASSES)

export_dataframe(users, 'users')
export_dataframe(future_classes, 'future_classes')
export_dataframe(past_classes, 'past_classes')
export_dataframe(ratings_matrix, 'ratings_matrix')

