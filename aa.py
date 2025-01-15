# import pandas as pd

# a = [1, 7, 2]

# myvar = pd.Series(a, index = ["x", "y", "z"])

# print(myvar)
# print(myvar["y"])


# calories = {"day1": 420, "day2": 380, "day3": 390}

# myva = pd.Series(calories, index = ["day1", "day2"])

# print(myva)

import pandas as pd

data = {
  "calories": [420, 380, 390],
  "duration": [50, 40, 45]
}

df = pd.DataFrame(data, index = ["day1", "day2", "day3"])

print(df.loc["day1"]) 