---
title: Statistics CM2018
description: KTH-CM2018
pubDate: Nov 12 2026
---

reference: https://adamsdarwich.github.io/stat4medeng/

This blog is for summary and term lookup. It only contains details that I think is important to me.

# 1 Basics
## 1.1 Introduction
- Box's learning cycle: theory -> prediction -> observation -> updating the theory
- Two key uses
  - Samples $\xrightarrow{infer}$ population features
  - Handle measurement variability & uncertainty
- Causation vs association

# 3 Generalised Linear Model (GLM)
Exponential family: a set of **distributions** whose probability formula can all be rewritten in **one common shape**:


$$
f(y)=\exp[\frac{y\cdot \theta − b(\theta)}{\phi} + c(y, \phi)]
$$


<details>
<summary> Examples </summary>

Discrete distribution

Poisson, y = 0, 1, 2, 3, ..., parameter: $\lambda$

$$
\begin{cases} 
P(y)=\frac{\lambda^y e^{-\lambda}}{y!}=\exp[y\ln \lambda -\lambda -\ln (y!)] \\
\theta=\ln \lambda, b(\theta)=e^\theta=\lambda,\phi=1, c=-\ln(y!)
\end{cases}
$$

Bernoulli, y = 0, 1, parameter: p

(binary distribution is not a formal name, people mostly refer it to Bernoulli or Binomial)

$$
\begin{cases} 
P(y)=p^y\cdot (1-p)^{1-y}=\exp[y\ln p + (1-y)\ln(1-p)] \\
\theta=\ln \frac{p}{1-p}, b(\theta)=\ln(1+e^\theta)=-\ln(1-p),\phi=1, c=0
\end{cases}
$$

Binomial, y = 0, 1, 2, ..., n, parameter: n, p

$$
\begin{cases} 
P(y)=\frac{n!}{y!(n-y)!}p^y \cdot (1-p)^{1-y}=\exp[y\ln p + (1-y)\ln(1-p)+] \\
\theta=\ln \frac{p}{1-p}, b(\theta)=\ln(1+e^\theta)=-\ln(1-p),\phi=1, c=0
\end{cases}
$$


</details>

normal, binomial, Poisson, gamma, exponential. They share a known mean–variance relationship, which allows one common framework.

# 4
## 4.1 Mixed-Effect Modelling

Linear regression
