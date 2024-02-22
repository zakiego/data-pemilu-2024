import pandas as pd
from sqlalchemy import create_engine

e = create_engine(
    "postgresql://ropantau:WW0xV00xZ3pRbWhqTTA0ellq@103.76.121.53:54321/pantau2024"
)


def get_list_tables():
    data = pd.read_sql(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
        e,
    )
    return data.unstack().tolist()


def export_table_to_csv(table_name):
    # count time process
    timeStart = pd.Timestamp.now()
    data = pd.read_sql(f"SELECT * FROM {table_name}", e)
    data.to_csv(f"src/releaser/{table_name}.csv", index=False)
    timeEnd = pd.Timestamp.now()
    timeElapsed = (timeEnd - timeStart).total_seconds()
    print(f"Exported {table_name}.csv in {timeElapsed} seconds")


def export_table_to_excel(table_name):
    # count time process
    timeStart = pd.Timestamp.now()
    data = pd.read_sql(f"SELECT * FROM {table_name}", e)
    data.to_excel(f"src/releaser/{table_name}.xlsx", index=False)
    timeEnd = pd.Timestamp.now()
    timeElapsed = (timeEnd - timeStart).total_seconds()
    print(f"Exported {table_name}.xlsx in {timeElapsed} seconds")


def main():
    tables = get_list_tables()
    for table in tables:
        export_table_to_csv(table)
        export_table_to_excel(table)


if __name__ == "__main__":
    main()
