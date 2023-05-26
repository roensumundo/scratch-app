import requests
import recommendation_engine as re

url = 'http://localhost:9026'

def signup_user(data):

    response = requests.post(url + '/signup', json=data)

    if response.status_code == 200:
        response_data = response.json()
        # Process the response data
        print(response_data)
    else:
        print('Error:', response.status_code)

def upload_users(users):
    for index, entry in users.iterrows():
        signup_user(entry.to_dict())

def upload_classes(classes):
    for index, entry in classes.iterrows():
        # TODO: upload a class
        pass


def main():

    users = re.from_csv_to_df('users')
    classes = re.from_csv_to_df('classes')
    ratings_matrix = re.from_csv_to_df('ratings_matrix')
    user_id = 100
    recommendations = re.get_recommended_classes(user_id, ratings_matrix, classes)
    similar_classes = re.get_similar_classes(classes, recommendations, 10)
    users = users.rename(columns={'city': 'location', 'trainer': 'isTrainer', 'name': 'fullname'})
    classes = classes.rename(columns={})
    #upload_users(users)

main()



