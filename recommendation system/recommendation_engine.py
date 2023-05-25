import pandas as pd

# Gets a list of rated classes for a user_id
def get_rated_classes(user_id, ratings_matrix):
    return list(ratings_matrix.loc[user_id].dropna().index)
    
# Gets the category of a class by class_id
def get_category(class_id, classes):
    return classes[classes['id'] == class_id].category.iloc[0]

# Gets the title of a class by class_id
def get_title(class_id, classes):
    return classes[classes['id'] == class_id].title.iloc[0]

# Gets the rating a user_id has given to a class_id
def get_rating(user_id, class_id, ratings_matrix):
    return ratings_matrix[class_id][user_id]

# Print rated classes
def print_rated_classes(user_id, rating_matrix, classes):
    for class_id in get_rated_classes(user_id, rating_matrix):
        print("%d %.1f %s " %
          (class_id, get_rating(user_id, class_id, rating_matrix), get_title(class_id, classes)))

def get_item_similarity(ratings_matrix):
    return ratings_matrix.corr()

def from_csv_to_df(filename):
    path = 'fake_data\\' + filename
    return pd.read_csv(path + '.csv')

def get_classes_relevance(user_id, ratings_matrix):
    
    # computes correlation between all combinations of items
    item_similarity_matrix = get_item_similarity(ratings_matrix)
    # Create an empty series
    classes_relevance = pd.Series()

    # Iterate through the classes the user has rated
    for class_rated in get_rated_classes(user_id, ratings_matrix):

        # Obtain the rating given
        rating_given = get_rating(user_id, class_rated, ratings_matrix)

        # Obtain the vector containing the similarities of class_rated
        # with all other class in item_similarity_matrix
        similarities = item_similarity_matrix[class_rated]

        # Multiply this vector by the given rating
        weighted_similarities = similarities * rating_given

        # Append these terms to classes_relevance
        classes_relevance = classes_relevance.append(weighted_similarities)

    # Compute the sum for each class
    classes_relevance = classes_relevance.groupby(classes_relevance.index).sum()

    # Convert to a dataframe
    classes_relevance_df = pd.DataFrame(classes_relevance, columns=['relevance'])
    classes_relevance_df['class_id'] = classes_relevance_df.index
    

    return classes_relevance_df

def get_recommended_classes(user_id, ratings_matrix, classes_df):
    classes_relevance = get_classes_relevance(user_id, ratings_matrix)
    classes_relevance = classes_relevance.set_index(classes_relevance["class_id"].to_numpy())
    classes_relevance = classes_relevance.sort_values("relevance", ascending=False)
    rated_classes = get_rated_classes(user_id, ratings_matrix)
    recommended_classes = classes_relevance.drop(rated_classes)

    recommended_classes = pd.merge(recommended_classes, classes_df, left_on='class_id', right_on='id', how='left')
    recommended_classes =  recommended_classes.drop(['datetime'], axis = 1)
    return recommended_classes

def main():

    users = from_csv_to_df('users')
    classes = from_csv_to_df('classes')
    ratings_matrix = from_csv_to_df('ratings_matrix')
    user_id = 100
    recommendations = get_recommended_classes(user_id, ratings_matrix, classes)
    print(recommendations)

main()