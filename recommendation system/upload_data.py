import requests
import recommendation_engine as re

url = 'http://localhost:9026'


def signup_user(data):

    response = requests.post(url + '/signup', json=data)

    if response.status_code == 200:
        response_data = response.json()
        # Process the response data
    else:
        print('Error:', response.status_code)

def upload_users(users):
    for index, entry in users.iterrows():
        signup_user(entry.to_dict())

def publish_class(data):
    response = requests.post(url + '/publish_class', json = data)
    if response.status_code == 200:
        response_data = response.json()
        # Process the response data
    else:
        print('Error:', response.status_code)

def upload_classes(classes):
    for index, entry in classes.iterrows():
        publish_class(entry.to_dict())

def enroll_to_class(username, class_id):
    response = requests.post(url + '/enrollment', json = {'username': username, 'class_id': class_id})
    if response.status_code == 200:
        response_data = response.json()
        # Process the response data
    else:
        print('Error:', response.status_code)



def upload_enrollments(users_df):
    for index, entry in users_df.iterrows():
        username = entry.username
        enrolled_classes = entry.enrolled_classes
        for class_id in eval(enrolled_classes):
            enroll_to_class(username, class_id)

def main():

    users = re.from_csv_to_df('users')
    future_classes = re.from_csv_to_df('future_classes')
    #past_classes = re.from_csv_to_df('past_classes')
    #ratings_matrix = re.from_csv_to_df('ratings_matrix')
    user_id = 100
    #recommendations = re.get_recommended_classes(user_id, ratings_matrix, past_classes)
    #similar_classes = re.get_similar_classes(future_classes, recommendations, 10)
    users = users.rename(columns={'city': 'location', 'trainer': 'isTrainer', 'name': 'fullname'})
    #upload_users(users)
    #upload_classes(future_classes)
    upload_enrollments(users)
    
    
   




main()



