---
title: Statistics CM2018
description: KTH-CM2018
pubDate: 2026-11-12
---

reference: https://adamsdarwich.github.io/stat4medeng/

This article is for summary and term lookup. It does not contain every detail, but only those I think is important.

==Highlight== for easy-to-forget ==terms==.

# 1 Basics

## 1.1 Introduction

Experiment: a procedure that will produce an outcome

Confirmatory data analysis (CDA): aim to confirm or refute an a priori formulated hypothesis (or a set of hypotheses) using an a priori defined statistical analysis method.

Exploratory data analysis (EDA), once we conduct EDA on a dataset, we cannot use the same datasets for a strict CDA approach, we cannot draw any firm conclusions based on this analysis.

==P-hacking==: find the optimal analytical methods to get the best possible p-value.

==Fishing==: conduct multiple statistical analyses across the dataset and present only those that are statistically significant

==HARKing==: hypothesising after the results are already known.

Two key uses
- Samples $\xrightarrow{infer}$ population features
- Handle measurement variability & uncertainty

Causation vs association

Experiment

Sample outcome (s): each potential outcome is a sample outcome.

Sample space (S): the totality of outcomes is the sample space.

Event: a collection of sample outcomes. An event can occur if an experimental outcome is a member of an event.

## 1.2 Data types

Data
- Numerical
	- Interval
		- Continuous: Celcius temperature
		- Discrete: calendar year
	- Ratio
		- Continuous: Kelvin temperature
		- Discrete: number of children
- Categorical
	- Ordinal: Likert scale ratings in psychology
	- Nominal: gender

## 1.3 Distributions

Notation
- Discrete: $p_X(k)=P(X=k)$ is the probability mass function (PMF), sometimes write P(k) as shorthand.
- Continuous: $f_Y(y)$ is the probability density function (PDF), for continuous distribution, P(Y=y)=0.

Lognormal: right-skewed and non-negative, common for biomarkers.

### 1.3.1 Poisson

Definition: it describes the number of events occurring in a fixed interval of time, assuming events occur **independently**, with the same expected number of events per unit of time (if the fixed interval is one unit of time, then the expected number is $\lambda$).

Generally, the rate is $r$ events per unit time, for an interval of length $t$, $\lambda=rt$

Derivation: split the time interval into n equal segments, if n goes to infinity, the events should occur at different segments, which is a binomial distribution, the probability of event occurring is $p=\lambda /n$

$$
P(y;\lambda)=\lim_{n\to \infty} \binom{n}{k}p^k(1-p)^{n-k}=\frac{\lambda^ye^{-\lambda}}{y!}
$$

Take logarithmic scale and the math is easy.

### 1.3.2 Gamma

If the events happen randomly at an average rate $\lambda$ (a **Poisson process**), the time until the k-th event follows a gamma distribution.

When k = 1, it's the exponential distribution $f(y)=\lambda e^{-\lambda}$

$$
f(y)=\frac{r^\alpha}{\Gamma(\alpha)}y^{\alpha-1}e^{-ry}
$$


### 1.3.3 Weibull

When fitting, Weibull is sensitive to starting values.

$$
f(x;\lambda, k)=
\begin{cases}
\frac{k}{\lambda}(\frac{x}{\lambda})^{k-1}\exp[-(\frac{x}{\lambda})^k], x\geq 0 \\
0, x < 0
\end{cases}
$$

### 1.3.4 Beta

$$
f(x;\alpha, \beta)=\text{constant} \cdot x^{\alpha-1}(1-x)^{\beta-1}
$$

$$
\text{constant}=\frac{\Gamma(\alpha+\beta)}{\Gamma(\alpha)\Gamma(\beta)}=\frac{1}{B(\alpha, \beta)}
$$

## 1.4 Transformations

Log transformation

Box-Cox transformation: use log-likelihood calculation to get the optimal $\lambda$

$$
y^{(\lambda)} = 
\begin{cases}
\ln y, \lambda=0 \\
\frac{y^{\lambda}-1}{\lambda}, \lambda \neq 0
\end{cases}
$$
## 1.5 Law and theorem

==Law of large numbers==: as the sample size increases, the sample mean tends to get closer to the true population mean

==Central limit theorem==: if we repeatedly take sufficiently large samples of **independent and identically distributed** observations from a population with a finite mean and variance, the distribution of the sample means will approach a normal distribution as the sample size increases—even if the original data are not normally distributed.

## 1.6 Sampling from distributions

Sampling underpins design, sample size estimation and Monte Carlo simulation.

Maximum likelihood has a closed form for normal and lognormal. Other distributions need numerical optimisation.

Methods: inverse transform sampling and Box–Muller.

Box-Muller: uniform -> normal
1. Draw two independent uniforms $U_1, U_2$ on (0, 1)
2. Compute
	1. $Z_1=\sqrt{-2\ln U_1}\cdot \cos(2\pi U_2)$
	2. $Z_2=\sqrt{-2\ln U_1}\cdot \sin(2\pi U_2)$
3. $Z_1$ and $Z_2$ are two independent standard normal N(0, 1) values. For $N(\mu, \sigma^2)$, use $\mu+\sigma Z$

## 1.7 Hypothesis testing

P-value: probability of a result at least as extreme, assuming H0

Parametric t-tests
- Normality: check with Q–Q plots, box plots, histograms and skewness/kurtosis. Shapiro–Wilk is generally unnecessary.
- Equal variances: conventional Student's t-test; unequal variances: Welch's t-test. In practice, Welch is always sensible.
- Paired vs unpaired is set by the design, and pairing often gives more power.

Type I error is $\alpha$, Type II error is $\beta$. Power $=1-\beta$

Family-wise error

A 95% CI captures the true value in about 95% of repeated samples.

Statistical significance does not imply clinical significance.

## 1.8 Nonparametric statistical tests

Nonparametric tests are distribution-free but still carry other assumptions. Classical methods use **signs or ranks**. Modern ones are **permutation tests and bootstrapping**.

Sign test

Wilcoxon signed rank test (paired data): `wilcox.test(x, y, paired = TRUE)`

Wilcoxon rank-sum / Mann-Whitney U test (two independent groups): `wilcox.test(x, y)`

Test of proportions
- Exact version (`binom.test`): parametric, use binomial distribution directly
- Normal-approximation version (`prop.test`, the z-test): approximates the binomial with a normal distribution, which needs a large enough sample, usually np and n(1-p) both $\geq 5$

# 3 Generalised Linear Model (GLM)

A simple linear model assumes the outcome follows a normal distribution, given x:

$$
Y \mid x \sim \mathcal{N}(\beta_0 + \beta_1 x, \sigma^2)
$$

It can seem unfamiliar, the same thing is:

$$
Y=\beta_0+\beta_1 x+\varepsilon, \varepsilon \sim \mathcal{N}(0,\sigma^2)
$$

So the mean changes linearly with x, and the variance is constant for all x. This constant variance is called ==homoscedasticity==.

the model does **not** assume that Y itself, or x, is normally distributed overall. Only the **residuals** (Y given x) should be normal. That is why you check normality with a residual Q–Q plot, not a histogram of Y.

There are different families of distribution. In one family, the distributions share a common mathematical form. Here we are only talking about 
The whole idea is to link 

## 3.1 Link between exponential family

==Exponential family== (normal, binomial, Poisson, gamma, exponential): a set of **distributions** whose probability formula can all be rewritten in ==one common shape==:

$$
f(y)=\exp[\frac{y\cdot \theta − b(\theta)}{\phi} + c(y, \phi)]
$$

### 3.1.1 Parameters

$$
\text{Normal:}
\begin{cases}
f(y)=\frac{1}{\sqrt{2\pi} \sigma}\exp[-\frac{(y-\mu)^2}{2\sigma^2}]=\exp[\frac{y\cdot \mu - \mu^2/2}{\sigma^2}-\frac{y^2}{2\sigma^2}-\frac{1}{2}\ln(2\pi\sigma^2)] \\
\theta=\mu, b(\theta)=\frac{\theta^2}{2}, \phi=\sigma^2, c=-\frac{y^2}{2\sigma^2}-\frac{1}{2}\ln(2\pi\sigma^2)
\end{cases}
$$

(binary distribution is not a formal name, people mostly refer it to Bernoulli or Binomial)

$$
\text{Bernoulli:}
\begin{cases} 
P(y)=p^y\cdot (1-p)^{1-y}=\exp[y\ln p + (1-y)\ln(1-p)] \\
\theta=\ln \frac{p}{1-p}, b(\theta)=\ln(1+e^\theta)=-\ln(1-p),\phi=1, c=0
\end{cases}
$$

$$
\text{Binomial:}
\begin{cases} 
P(y)=\frac{n!}{y!(n-y)!}p^y \cdot (1-p)^{1-y}=\exp[y\ln p + (1-y)\ln(1-p)+] \\
\theta=\ln \frac{p}{1-p}, b(\theta)=\ln(1+e^\theta)=-\ln(1-p),\phi=1, c=0
\end{cases}
$$

$$
\text{Poisson:}
\begin{cases} 
P(y)=\frac{\lambda^y e^{-\lambda}}{y!}=\exp[y\ln \lambda -\lambda -\ln (y!)] \\
\theta=\ln \lambda, b(\theta)=e^\theta=\lambda,\phi=1, c=-\ln(y!)
\end{cases}
$$

$$
\text{Gamma:}
\begin{cases}
f(y)=\frac{1}{}
\end{cases}
$$

**Gamma**, y>0, parameter

$\theta$: ==natural parameter==

$b(\theta)$: function that differs by distribution. Everything important comes from it.
- Mean: $\mu = b'(\theta)$, the first derivative
- Variance: $Var(Y)=\phi \times b''(\theta)$, the second derivative

$\phi$: a ==scale or dispersion parameter==. 

Think of $\phi$ as a volume knob for the spread.

$c(y, \phi)$ is the leftover bit that doesn't involve $\theta$, it doesn't matter for fitting

### 3.1.2 Canonical link

==Canonical link==: link that sets the linear predictor equal to the distribution's natural parameter: $\eta = \theta$


### 3.1.3 Analysis

Normal: $c=-\frac{y^2}{2\sigma^2}-\frac{1}{2}\ln(2\pi\sigma^2)$, which has no $\mu$, so it can be ignored in the fitting.

Gamma: mean = $b'=-1/\theta=\mu$, var = $\phi\cdot b''=(1/\nu)\cdot(1/\theta^2)=\mu^2/\nu$, so SD grows in proportion with mean



a known relationship between the mean and the variance, and straightforward calculations of the log-likelihood derivative



**5. Why this gives “one common framework”**

- **Same fitting algorithm.** The equations at the peak are always Σx(y − μ) = 0 for the canonical link. You saw this for logistic (y − p) and Poisson (y − λ), and least squares gives the same equations.
- **Same weights.** The iterative fit weights each observation by 1/Var: p(1 − p) for logistic and λ for Poisson. Those are the weights from the information-matrix answer, and they’re just the variance column of the table.
- **Same deviance, same SEs, same tests** (LR, Wald), so one function, `glm(family = ...)`, does all of them.
- **A built-in check.** Because the variance is _assumed_ from the mean, you can test it. Overdispersion in Poisson is exactly “the real variance is bigger than μ”, and the dispersion ratio of 3.20 in the worked file measured that.

**Not in the family** (with an unknown shape parameter): Weibull, the t-distribution, the negative binomial when θ is estimated. That’s why those need their own functions, such as `MASS::glm.nb()`, rather than plain `glm()`.

Discrete distribution






Any linear re-labelling of $\theta$ works, as long as $b,\phi, c$ are adjusted to compensate: $\theta \to \theta + 1, \theta \to 2\theta$

Everything that matters (mean, variance) stay the same (easy to verify).

normal, binomial, Poisson, gamma, exponential. They share a known mean–variance relationship, which allows one common framework.

# 4
## 4.1 Mixed-Effect Modelling

Linear regression

# R

# Seminar

