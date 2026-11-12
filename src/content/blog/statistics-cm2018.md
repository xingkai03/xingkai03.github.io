---
title: Statistics CM2018
description: KTH-CM2018
pubDate: 2026-11-12
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

Exponential family: a set of **distributions** whose probability formula can all be rewritten in ==one common shape==:

$$
f(y)=\exp[\frac{y\cdot \theta − b(\theta)}{\phi} + c(y, \phi)]
$$

Canonical link

**5. Why this gives “one common framework”**

- **Same fitting algorithm.** The equations at the peak are always Σx(y − μ) = 0 for the canonical link. You saw this for logistic (y − p) and Poisson (y − λ), and least squares gives the same equations.
- **Same weights.** The iterative fit weights each observation by 1/Var: p(1 − p) for logistic and λ for Poisson. Those are the weights from the information-matrix answer, and they’re just the variance column of the table.
- **Same deviance, same SEs, same tests** (LR, Wald), so one function, `glm(family = ...)`, does all of them.
- **A built-in check.** Because the variance is _assumed_ from the mean, you can test it. Overdispersion in Poisson is exactly “the real variance is bigger than μ”, and the dispersion ratio of 3.20 in the worked file measured that.

**Not in the family** (with an unknown shape parameter): Weibull, the t-distribution, the negative binomial when θ is estimated. That’s why those need their own functions, such as `MASS::glm.nb()`, rather than plain `glm()`.

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

Continuous distribution



- Mean: $\mu = b'(\theta)$, the first derivative
- Variance: $Var(Y)=\phi \times b''(\theta)$, the second derivative

Any linear re-labelling of $\theta$ works, as long as $b,\phi, c$ are adjusted to compensate: $\theta \to \theta + 1, \theta \to 2\theta$

Everything that matters (mean, variance) stay the same (easy to verify).

normal, binomial, Poisson, gamma, exponential. They share a known mean–variance relationship, which allows one common framework.

# 4
## 4.1 Mixed-Effect Modelling

Linear regression
