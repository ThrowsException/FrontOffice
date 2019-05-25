import os
import re

from setuptools import find_packages, setup

install_requires = [
    'aiohttp',
    'psycopg2-binary'
]


setup(name='bench-app',
      version='0.0.1',
      description='Url shortener for aiohttp',
      packages=find_packages(),
      include_package_data=True,
      install_requires=install_requires,
      zip_safe=False)
