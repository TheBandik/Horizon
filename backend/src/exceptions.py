class NotFoundError(Exception):
    def __init__(self, entity: str):
        self.entity = entity
        super().__init__(f"{entity} not found")


class DuplicateEntryError(Exception):
    def __init__(self, entity: str, field: str):
        super().__init__(f"Duplicate {entity} for {field}")
