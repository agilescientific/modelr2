from enum import Enum
from pydantic import BaseModel


class Section(str, Enum):
    x = "x"
    y = "y"
    z = "z"


class Extent(BaseModel):
    x: int
    X: int
    y: int
    Y: int
    z: int
    Z: int


class Model(BaseModel):
    extent: Extent
    history: str
    rock_library: str = None