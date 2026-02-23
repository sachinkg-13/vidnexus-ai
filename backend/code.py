import matplotlib.pyplot as plt

# Sample defect data
defects = {
    "Porosity": 45,
    "Surface Defect": 30,
    "Dimensional Error": 15,
    "Crack": 7,
    "Others": 3
}

labels = list(defects.keys())
values = list(defects.values())

plt.figure()
plt.bar(labels, values)
plt.xlabel("Defect Types")
plt.ylabel("Number of Defects")
plt.title("Pareto Analysis Chart for Manufacturing Defects")
plt.tight_layout()
plt.show()
