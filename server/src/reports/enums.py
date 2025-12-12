from enum import Enum

class ReportStatus(str, Enum):
    OPEN = "open"
    RESOLVED = "resolved"

class ReportAction(str, Enum):
    REMOVE_SHOUTOUT = "remove_shoutout"
    IGNORE = "ignore"  # optional if needed
