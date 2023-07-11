from flask import session
from functools import wraps

    
def main():
    ...


def login_required(f):
    
    # Decorate routes to require login.

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function


def function_2():
    ...


def function_n():
    ...


if __name__ == "__main__":
    main()