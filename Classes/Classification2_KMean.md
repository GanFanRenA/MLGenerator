# Classification 2: K-Means Clustering

## Lesson objective

Use the cleaned Nigerian Spotify song dataset from Classification 1 to build an
unsupervised K-Means clustering model. By the end of this lesson, you will be
able to:

- compare feature scales before measuring distances;
- standardize numerical features for K-Means;
- use the elbow method to compare candidate cluster counts;
- fit and visualize a cluster model;
- evaluate clusters with silhouette scores and feature profiles;
- explain why genre labels are useful for interpretation but not ground-truth
  answers for an unsupervised model.

Continue in `model.py` with the filtered `df` from Classification 1. It should
contain 286 rows from the `afro dancehall`, `afropop`, and `nigerian pop` genres.
The genre column will remain available for interpretation, but it will not be
used as a training feature.

## Step 1: Profile feature scales

K-Means groups samples by distance. A feature measured in tens or hundreds can
therefore have much more influence than a feature measured between 0 and 1.

Start by summarizing and plotting the numeric features:

```python
numeric_columns = [
    "popularity", "danceability", "acousticness",
    "energy", "instrumentalness", "liveness",
    "loudness", "speechiness", "tempo",
]

print(df[numeric_columns].agg(["min", "max", "std"]).T)

plt.figure(figsize=(18, 12))
for index, column in enumerate(numeric_columns, start=1):
    plt.subplot(3, 3, index)
    sns.boxplot(x=df[column])
    plt.title(column)

plt.tight_layout()
plt.show()
```

Expected result:

- the table reports the minimum, maximum, and standard deviation of each feature;
- the figure contains nine boxplots;
- the ranges are visibly different;
- there are some outliers, but they are not automatically errors.

Do not remove every unusual song by default. An outlier can represent a real
musical pattern, and removing samples changes the evidence available to the
model.

## Step 2: Select and standardize features

Use five numerical features for the first experiment:

```python
from sklearn.preprocessing import StandardScaler

features = [
    "popularity", "danceability", "acousticness",
    "loudness", "energy",
]

X = df[features].copy()

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print("X shape:", X.shape)
print("Scaled means:", X_scaled.mean(axis=0).round(6))
print("Scaled deviations:", X_scaled.std(axis=0).round(6))
```

Expected result:

- `X.shape` is `(286, 5)`;
- the scaled means are approximately 0;
- the scaled standard deviations are approximately 1;
- `artist_top_genre` is not in `X`.

Standardization puts the features on comparable numerical scales. It does not
change the number of songs and it does not use the genre labels to fit the model.

## Step 3: Use the elbow method

Fit models with different numbers of clusters and record their within-cluster
sum of squares (WCSS), also called inertia:

```python
from sklearn.cluster import KMeans

wcss = []

for k in range(1, 11):
    model = KMeans(
        n_clusters=k,
        init="k-means++",
        n_init=10,
        random_state=42,
    )
    model.fit(X_scaled)
    wcss.append(model.inertia_)

print(wcss)

sns.lineplot(x=range(1, 11), y=wcss, marker="o", color="red")
plt.title("Elbow method")
plt.xlabel("Number of clusters")
plt.ylabel("WCSS")
plt.show()
```

Expected result:

- `wcss` contains ten values;
- the values decrease as more centroids are added;
- the curve shows a point after which each additional cluster produces a smaller
  reduction in error;
- the bend suggests a candidate cluster count, often around three in this
  exercise.

The elbow is a guide rather than an automatic answer. Compare it with model
quality, cluster sizes, and whether the groups can be interpreted.

## Step 4: Fit and visualize the model

Fit a three-cluster model and attach its labels to a copy of the DataFrame:

```python
kmeans = KMeans(
    n_clusters=3,
    init="k-means++",
    n_init=10,
    random_state=42,
)

labels = kmeans.fit_predict(X_scaled)

df_clustered = df.copy()
df_clustered["cluster"] = labels

print(df_clustered["cluster"].value_counts().sort_index())

sns.scatterplot(
    data=df_clustered,
    x="popularity",
    y="danceability",
    hue="cluster",
    palette="deep",
)
plt.title("K-Means clusters by popularity and danceability")
plt.show()
```

Expected result:

- the cluster counts add to 286;
- the plot uses three colors;
- the groups can overlap in this two-dimensional view because the model used
  five dimensions.

Cluster numbers such as 0, 1, and 2 are arbitrary identifiers. Relabeling them
would not change which songs belong together.

## Step 5: Evaluate and interpret the clusters

Use silhouette scoring and centroid profiles:

```python
from sklearn.metrics import silhouette_score

score = silhouette_score(X_scaled, labels)
print(f"Silhouette score: {score:.3f}")

centers = scaler.inverse_transform(kmeans.cluster_centers_)
centers_df = pd.DataFrame(centers, columns=features).round(3)
print(centers_df)

genre_counts = pd.crosstab(
    df_clustered["cluster"],
    df_clustered["artist_top_genre"],
)
print(genre_counts)
```

Expected result:

- the silhouette score is between `-1` and `1`;
- values closer to 1 indicate better-separated, more cohesive clusters;
- values near 0 indicate overlap;
- `centers_df` has three rows and five feature columns;
- the crosstab shows how songs from the original genres are distributed across
  the learned clusters.

The centroid values are inverse-transformed back to their original units. This
makes the profile easier to explain.

Silhouette scoring does not require correct class labels. It measures the
geometry of the partition. A cluster-by-genre crosstab is descriptive evidence:
it helps you interpret overlap between musical categories, but it is not a
direct accuracy score.

## Step 6: Refine the experiment

Compare cluster counts with a reusable evaluation function:

```python
def evaluate_clusters(feature_frame, k):
    candidate_scaler = StandardScaler()
    candidate_scaled = candidate_scaler.fit_transform(feature_frame)

    candidate_model = KMeans(
        n_clusters=k,
        init="k-means++",
        n_init=10,
        random_state=42,
    )
    candidate_labels = candidate_model.fit_predict(candidate_scaled)
    candidate_score = silhouette_score(candidate_scaled, candidate_labels)
    return candidate_score, candidate_model.inertia_

for k in range(2, 7):
    score, inertia = evaluate_clusters(X, k)
    print(f"k={k}: silhouette={score:.3f}, inertia={inertia:.3f}")

without_popularity = X.drop(columns=["popularity"])
for k in range(2, 5):
    score, inertia = evaluate_clusters(without_popularity, k)
    print(f"No popularity, k={k}: silhouette={score:.3f}, inertia={inertia:.3f}")
```

Expected result:

- five lines report results for `k = 2` through `k = 6`;
- three additional lines report the reduced feature set;
- every comparison standardizes the data and uses the same initialization and
  random seed;
- you can justify a candidate using the elbow curve, silhouette score, cluster
  sizes, and centroid profiles.

Do not choose a solution only because it has the highest silhouette score. The
best clustering depends on the question you want the groups to answer.

## Reflection

1. Why does K-Means need scaled features when the original units are different?
2. Why should `artist_top_genre` stay out of the feature matrix?
3. What information does the silhouette score measure?
4. Why is a high silhouette score insufficient on its own?
5. What changed when popularity was removed from the feature set?

If you want to continue, try another feature combination, explain why each
feature belongs in the experiment, and compare the resulting centroid profiles.
