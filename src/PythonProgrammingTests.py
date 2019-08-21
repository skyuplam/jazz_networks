#!/usr/bin/env python
# coding: utf-8

# 1. Define a generator which generates the positive integers up to and including a supplied value which are divisible by another supplied positive integer and use it to calculate the sum of all positive integers less than 102030 which are divisible by 3

# In[1]:


102030 // 3


# In[2]:


# Thus the biggest multiple of 3 smaller than 102030 is
(34010 - 1) * 3


# In[3]:


# Thus the sum of all positive integer less than 102030 is
# (1 + 2 + 3 + ... + 34009) * 3, using the formular of sumation from 1 to n = n(n+1)/2
34009 * 34010 // 2 * 3


# In[4]:


# A generator which generates the positive integers up to and
# including a supplied value (ceil) which are divisible by
# another supplied positive integer (dividedBy)
def gen_int_divided_by(ceil, dividedBy):
    for d in range(3, ceil + 1, dividedBy):
        yield d


# In[5]:


# The biggest positive integer lesser than 102030 is 102029
sum(i for i in gen_int_divided_by(102029, 3))


# 2. Write a function which is passed an integer, n, and returns a list of n lists such that:
# ```
# f(0) returns []
# f(1) returns [[1]]
# f(2) returns [[1], [1,2]]
# f(3) returns [[1], [1,2], [1,2,3]] etc.
# ```

# In[19]:


def generate_list(n):
    return [[i + 1 for i in range(grp)] for grp in range(1, n + 1)]


# In[30]:


for n in range(10):
    print(f'f({n}) = {generate_list(n)}')

