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


def generate_fake_classes(n, users_df):
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

    for id in range(n):
        price = np.random.normal(mean_price, var_price, 1)[0]
        price = round(price,2)
        random_days = random.randint(1, 365)
        # Generate a random number of 30-minute intervals
        random_intervals = random.randint(0, 48)  # 48 intervals in a day (24 hours * 2 intervals per hour) 
        record = {'id': id, 'category': fake.fitness_discipline(), 'creator': random.choice(trainers_ids(users_df)) ,
                'level':fake.level(), 'maxUsers': random.randint(1, 50), 'price': price, 'datetime': approx_today+ timedelta(days=random_days, minutes=30 * random_intervals)}
        record['title'] = 'A ' + record['category'] + ' class'
        duration_h = random.choice(possible_durations_h)
        duration = str(duration_h) + ' h '
        if(duration_h != 2):
            duration_min = random.choice(possible_durations_min)
            if(duration_min != 0):
                duration +=  str(duration_min) + ' min'
        record['duration'] = duration


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
classes = generate_fake_classes(NUM_CLASSES, users)
ratings_matrix = generate_fake_ratings(NUM_USERS,NUM_CLASSES)

export_dataframe(users, 'users')
export_dataframe(classes, 'classes')
export_dataframe(ratings_matrix, 'ratings_matrix')

