from sqlmodel import Session
from app.database import create_db_and_tables, engine
from app.models import Shout


def main() -> None:
    # Ensure tables exist
    create_db_and_tables()

    # Insert a few dummy shouts
    with Session(engine) as session:
        shouts = [
            Shout(message="Hello BragBoard!", author_name="Tester"),
            Shout(message="First dummy post", author_name="Alice"),
            Shout(message="Second dummy post", author_name="Bob"),
        ]
        session.add_all(shouts)
        session.commit()

        for s in shouts:
            session.refresh(s)

        print(f"Inserted {len(shouts)} shouts. IDs: {[s.id for s in shouts]}")


if __name__ == "__main__":
    main()