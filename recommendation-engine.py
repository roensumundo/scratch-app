import pandas as pd
import numpy as np
from keras.layers import Input, Embedding, Flatten, Dot
from keras.models import Model
import redis
import fakeredis

"""Fake data"""

# create a fake Redis database
fake_redis = fakeredis.FakeStrictRedis()

# create sample data
users = [
    {'id': 1, 'name': 'John Doe', 'age': 30, 'gender': 'male', 'location': 'New York'},
    {'id': 2, 'name': 'Jane Smith', 'age': 25, 'gender': 'female', 'location': 'San Francisco'},
    {'id': 3, 'name': 'Bob Johnson', 'age': 35, 'gender': 'male', 'location': 'Chicago'},
]

courses = [
    {'id': 1, 'name': 'Yoga for Beginners', 'level': 'beginner', 'duration': 30, 'price': 50},
    {'id': 2, 'name': 'Weight Training 101', 'level': 'intermediate', 'duration': 45, 'price': 75},
    {'id': 3, 'name': 'Marathon Training', 'level': 'advanced', 'duration': 60, 'price': 100},
]

# store the data in Redis
for user in users:
    fake_redis.hmset(f"user:{user['id']}", user)
for course in courses:
    fake_redis.hmset(f"course:{course['id']}", course)


"""-------------------"""
import numpy as np

# create a user-item matrix
user_item_matrix = np.zeros((len(users), len(courses)))
for user in users:
    for course in courses:
        rating = fake_redis.hget(f"user:{user['id']}", f"rating:{course['id']}")
        if rating is not None:
            user_item_matrix[user['id'] - 1][course['id'] - 1] = float(rating)

# create an item-item similarity matrix
item_item_similarity = np.zeros((len(courses), len(courses)))
for i in range(len(courses)):
    for j in range(len(courses)):
        if i == j:
            item_item_similarity[i][j] = 1.0
        else:
            # calculate the cosine similarity between course i and course j
            ratings_i = user_item_matrix[:, i]
            ratings_j = user_item_matrix[:, j]
            sim = np.dot(ratings_i, ratings_j) / (np.linalg.norm(ratings_i) * np.linalg.norm(ratings_j))
            item_item_similarity[i][j] = sim





"""Deep learning model: NNCF neural network-based Collaborative Filtering""" 
df = pd.DataFrame({
    'User ID': [1, 1, 2, 2, 3, 3],
    'Course ID': [101, 102, 101, 103, 102, 103],
    'Rating': [5, 3, 4, 5, 2, 4]
})

ratings_matrix = df.pivot_table(values='Rating', index='User ID', columns='Course ID')


num_users = ratings_matrix.shape[0]
num_courses = ratings_matrix.shape[1]

user_input = Input(shape=[1])
user_embedding = Embedding(num_users, 10)(user_input)
user_flat = Flatten()(user_embedding)

course_input = Input(shape=[1])
course_embedding = Embedding(num_courses, 10)(course_input)
course_flat = Flatten()(course_embedding)

dot = Dot(axes=1)([user_flat, course_flat])

model = Model(inputs=[user_input, course_input], outputs=dot)
model.compile(loss='mse', optimizer='adam')
model.fit([user_ids, course_ids], ratings, epochs=10)



# Get the list of course IDs that User 1 has not yet taken
not_taken = np.where(ratings_matrix.loc[1].isnull())[0]

# Create arrays of user IDs and course IDs for the not-taken courses
user_ids = np.full(len(not_taken), 1, dtype=int)
course_ids = not_taken.reshape(-1, 1)

# Use the trained model to predict the ratings for the not-taken courses
predicted_ratings = model.predict([user_ids, course_ids]).flatten()

# Sort the courses by predicted rating in descending order and select the top 3
top_courses = not_taken[np.argsort(predicted_ratings)[::-1]][:3]