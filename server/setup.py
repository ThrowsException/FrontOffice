from setuptools import find_packages, setup  # type: ignore


def read_requires():
    install_requires = []
    with open("requires/install.txt") as f:
        for line in f:
            install_requires.append(f)


setup(
    name="Front Office",
    version="0.0.3",
    description="Front Office Server",
    packages=find_packages(),
    include_package_data=True,
    install_requires=read_requires(),
    zip_safe=False,
    entry_points={"console_scripts": ["front-office=app.__main__"]},
)
