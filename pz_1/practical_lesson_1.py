from datetime import datetime
# task 1
print("===TASK1===")
print(*range(1, 11))
print("===TASK1===")



#task 2
print("===TASK2===")
print(sum(float(input()) for _ in range(3)) / 3)
print("===TASK2===")

#task 3
print("===TASK3===")
year = int(input("Введіть день народження: "))
current_year = datetime.now().year

print(current_year - year)
print("===TASK3===")

#task 4
print("===TASK4===")
class Book:
    def __init__(self, title, author, year):
        self.title = title
        self.author = author
        self.year = year


book1 = Book("1984", "George Orwell", 1949)

print("Назва:", book1.title)
print("Автор:", book1.author)
print("Рік:", book1.year)
print("===TASK4===")

