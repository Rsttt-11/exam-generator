## 第十章 行列式

## 基础题

## 一、选择题

(1) 设行列式 $D = \begin{vmatrix} 3 & 0 & 4 & 0 \\ 2 & 2 & 2 & 2 \\ 0 & -7 & 0 & 0 \\ 5 & 3 & -2 & 2 \end{vmatrix}$ ，则 D 的第 4 行各元素的余子式之和 $M_{41} + M_{42} + M_{43} + M_{44} = (\ )$ .
A. -28 B. 28 C. 14 D. -14

(2) 设 $\beta_{1}, \beta_{2}, \alpha_{1}, \alpha_{2}, \alpha_{3}$ 均是 4 维列向量，且 $|A| = |\beta_{1}, \alpha_{1}, \alpha_{2}, \alpha_{3}| = 1, |B| = |\beta_{2}, \alpha_{1}, 3\alpha_{2}, \alpha_{3}| = 3$ ，则 $|A + B| = (\quad)$ .

A. 15    B. 16    C. 31    D. 32

(3) 设 3 阶矩阵 $A = \left(a_{ij}\right)_{3 \times 3}$ 满足 $A^T = kA^* (k > 0)$ ，若 $a_{11} = a_{12} = a_{13} = c > 0$ ，则 $c = (\quad)$ A. $\frac{\sqrt{3}}{3k}$ B. $\frac{\sqrt{3}k^2}{3}$ C. $\sqrt{3}k^2$ D. $\frac{\sqrt{3}}{k^2}$ 

## 二、填空题

(1) $\left| \begin{array}{cccc}k & 0 & -1 & 1\\ 0 & k & 1 & -1\\ -1 & 1 & k & 0\\ 1 & -1 & 0 & k \end{array} \right| = \_$ . 

(2) 若 $\begin{vmatrix}\lambda-a&-1&-1\\-1&\lambda-a&1\\-1&1&\lambda-a\end{vmatrix}=0,$ 则 $\lambda=$ ____.

$$
(3) D _ {4} = \left| \begin{array}{c c c c} 1 & 0 & 0 & 1 \\ 0 & 2 & 0 & 1 \\ 0 & 0 & 3 & 1 \\ 1 & 1 & 1 & 4 \end{array} \right| = \underline {{{\quad}}}.
$$

(4) 行列式 $D_{4}=\left|\begin{matrix}0&1&2&0\\ 1&0&0&2\\ 0&3&4&0\\ 3&0&0&4\end{matrix}\right|=$ ____.

(5) 设 $f(x)=\left|\begin{matrix}x & -2x & 1 & 2 \\ 1 & x & 1 & -1 \\ 3 & 2 & 3x & 1 \\ 1 & 1 & 1 & x\end{matrix}\right|$ ，则 $x^{3}$ 的系数为 ____.

(6) 设 A 是 n 阶方阵，且 $AA^{T}=E,\quad|A|<0$ ，则 $|A+E|=$ ____.

(7) 设 A 是 n 阶方阵, E 是 n 阶单位矩阵, 且 $A^{2} = A, A \neq E$ , 则 $|A| =$ ____.

(8) 设 A, B 均为 n 阶方阵, 且 $\left|A\right| = \left|B\right| = \left|A^{-1} + B\right| = 2$ , 则 $\left|A + B^{-1}\right| =$ ____.

(9) 设 $|A|=2,|B|=-2$ ，其中 A, B 均为 n 阶方阵，则 $\left|A^{-1}B^{*}-A^{*}B^{-1}\right|=$ ____.

(10) 设 3 阶方阵 $A = (\alpha_{1}, \alpha_{2}, \alpha_{3}), B = (3\alpha_{1} - \alpha_{2}, 3\alpha_{2} - 2\alpha_{1}, 2\alpha_{3} - \alpha_{1} - 2\alpha_{2})$ ，且 $|B| = 14$ ，则 $|A| =$ ____.

(11) 设 $A = \left(a_{ij}\right)_{n \times n}$ 为 n 阶方阵, $|A| = 1$ , 且 A 的每列元素之和均为 $k (k \neq 0)$ , 则 A 的代数余子式之和 $A_{11} + A_{12} + \cdots + A_{1n} =$ ____.

## 三、解答题

(1) 计算 n 阶行列式 $D_{n}=\left|\begin{matrix}b & a & a & \cdots & a \\ a & b & a & \cdots & a \\ \vdots & \vdots & \vdots & & \vdots \\ a & a & a & \cdots & b\end{matrix}\right|$ .

(2) 计算 $n$ 阶行列式

$$
D _ {n} = \left| \begin{array}{c c c c c c} 2 & - 1 & 0 & \dots & 0 & 0 \\ - 1 & 2 & - 1 & \dots & 0 & 0 \\ 0 & - 1 & 2 & \dots & 0 & 0 \\ \vdots & \vdots & \vdots & & \vdots & \vdots \\ 0 & 0 & 0 & \dots & 2 & - 1 \\ 0 & 0 & 0 & \dots & - 1 & 2 \end{array} \right|.
$$

(3) 计算 $n$ 阶行列式

$$
D _ {n} = \left| \begin{array}{c c c c c c} a _ {1} & b _ {1} & 0 & \dots & 0 & 0 \\ 0 & a _ {2} & b _ {2} & \dots & 0 & 0 \\ \vdots & \vdots & \vdots & & \vdots & \vdots \\ 0 & 0 & 0 & \dots & a _ {n - 1} & b _ {n - 1} \\ b _ {n} & 0 & 0 & \dots & 0 & a _ {n} \end{array} \right| + \left| \begin{array}{c c c c c c} a _ {1} & 0 & 0 & \dots & 0 & b _ {n} \\ b _ {1} & a _ {2} & 0 & \dots & 0 & 0 \\ 0 & b _ {2} & a _ {3} & \dots & 0 & 0 \\ \vdots & \vdots & \vdots & & \vdots & \vdots \\ 0 & 0 & 0 & \dots & a _ {n - 1} & 0 \\ 0 & 0 & 0 & \dots & b _ {n - 1} & a _ {n} \end{array} \right|,
$$

其中 $a_{i}, b_{i}$ 均不为0.

## 综合题

## 一、选择题

(1) 设 A 是 3 阶可逆矩阵， $A^{-1}$ 的特征值为 3,2,1，则 $|A|$ 的代数余子式之和 $A_{11} + A_{22} + A_{33} = (\quad)$ .
A. $\frac{1}{6}$ B. $\frac{1}{3}$ C. $\frac{1}{2}$ D. 1

这是一条为了防止被小坏蛋拿去转卖抹掉的水印，发出来的资料都是免费获取(这里 https://nocode.host/hjr2pw)

(2) 设 A 是 3 阶方阵， $A^{*}$ 是 A 的伴随矩阵， $|A| = \frac{1}{2}$ ，则 $\left|(2A)^{-1} - 2A^{*}\right| = (\quad)$ .  
A. $\frac{1}{2}$ B. $-\frac{1}{2}$ C. $-\frac{1}{4}$ D. $\frac{1}{4}$ 

(3) 设 $f(x)=\left|\begin{matrix}1 & x & x^{2} & x^{3}\\ 1 & 2 & 4 & 8\\ 1 & -1 & 1 & -1\\ 1 & 1 & 1 & 1\end{matrix}\right|$ ，则曲线 $y=f(x)$ 在 $(-1,2)$ 内存在水平切线的条数为（）.
A. 1 B. 2 C. 3 D. 4

## 二、填空题

(1) 设 A, B 均为 n 阶方阵， $|A| = 6,\quad |B| = 1,\quad C = \begin{pmatrix} A & 3A^{*}\\ \left(\frac{B}{2}\right)^{-1} & O \end{pmatrix}$ ，则 $|C| =$ ____ .

(2) 设 A, B 均为 3 阶方阵, 满足 $A^{2}B - A - B = E$ , 若 $A = \begin{pmatrix} 1 & 0 & 1 \\ 0 & 2 & 0 \\ -2 & 0 & 1 \end{pmatrix}$ , 则 $|B| =$ ____ .

(3) 设 A 是 3 阶方阵, 且满足 $\left|A-E\right|=\left|A+2E\right|=\left|2A+3E\right|=0$ , 则 $\left|2A^{*}-3E\right|=$ ____.

(4) 设 A 是 3 阶方阵， $\alpha_{1},\alpha_{2},\alpha_{3}$ 线性无关，且 $A\alpha_{1}=a_{1}+a_{2},A\alpha_{2}=a_{2}+a_{3},A\alpha_{3}=a_{3}+\alpha_{1}$ ，则 $|A|=$ ____。

(5) 设 $\alpha, \beta, \alpha_{1}, \alpha_{2}, \alpha_{3}$ 均为 4 维列向量, $A = (\alpha, \alpha_{1}, \alpha_{2}, \alpha_{3}), B = (\beta, \alpha_{1}, \alpha_{2}, \alpha_{3})$ , 且 $|A| = 2, |B| = 1$ ，则 $|A^{-1} + B^{-1}| =$ ____ .

(6) 设 n 阶行列式 $|A| = \begin{vmatrix} 0 & 1 & 0 & \cdots & 0 \\ 0 & 0 & 2 & \cdots & 0 \\ \vdots & \vdots & \vdots & & \vdots \\ 0 & 0 & 0 & \cdots & n-1 \\ n & 0 & 0 & \cdots & 0 \end{vmatrix}$ ，则 $|A|$ 的第 k 行元素的代数余子式之和 $A_{k1} + A_{k2} + \cdots + A_{kn} =$ ____.

## 三、解答题

(1) 计算 n 阶行列式 $D_{n}=\left|\begin{matrix}b-a_{1}^{2}&-a_{1}a_{2}&\cdots&-a_{1}a_{n}\\ -a_{2}a_{1}&b-a_{2}^{2}&\cdots&-a_{2}a_{n}\\ \vdots&\vdots&&\vdots\\ -a_{n}a_{1}&-a_{n}a_{2}&\cdots&b-a_{n}^{2}\end{matrix}\right|$ .

(2) 计算 n 阶行列式 $D_{n}=\left|\begin{matrix}a+b_{1}&a&\cdots&a\\ a&a+b_{2}&\cdots&a\\\vdots&\vdots&&\vdots\\ a&a&\cdots&a+b_{n}\end{matrix}\right|(b_{i}\neq0).$ 

(3) 计算 $n$ 阶行列式

$$
D _ {n} = \left| \begin{array}{c c c c c c} a _ {0} & - 1 & 0 & \dots & 0 & 0 \\ a _ {1} & x & - 1 & \dots & 0 & 0 \\ a _ {2} & 0 & x & \dots & 0 & 0 \\ \vdots & \vdots & \vdots & & \vdots & \vdots \\ a _ {n - 2} & 0 & 0 & \dots & x & - 1 \\ a _ {n - 1} & 0 & 0 & \dots & 0 & x \end{array} \right|.
$$

(4) 计算

$$
D _ {n} = \left| \begin{array}{c c c c c c} a & b & 0 & \dots & 0 & 0 \\ c & a & b & \dots & 0 & 0 \\ 0 & c & a & \dots & 0 & 0 \\ \vdots & \vdots & \vdots & & \vdots & \vdots \\ 0 & 0 & 0 & \dots & a & b \\ 0 & 0 & 0 & \dots & c & a \end{array} \right| (a ^ {2} - 4 b c \geqslant 0).
$$

## 拓展题

## 解答题

(1) 设矩阵 A 为 3 阶非零实矩阵， $A^{T}=A^{*}$ ，且 $|E+A|=|E-A|=0$ ，计算行列式 $\left|A^{2}-A-3E\right|$ .

(2) 设 A 为 3 阶非零实矩阵，且 $A^{T} = kA^{*}$ (k 为非零常数).

(I) 证明: A 是可逆矩阵;

(II) 求行列式 $\left|A^{-1}\right| + \left|\left(A^{*}\right)^{-1}\right|$ .

## 第十一章 矩阵

## 基础题

## 一、选择题

(1) 设 $A = \left(a_{ij}\right)_{3 \times 3}$ , $B = \begin{pmatrix} a_{21} & a_{22} + a_{23} & a_{23} \\ a_{31} & a_{32} + a_{33} & a_{33} \\ a_{11} & a_{12} + a_{13} & a_{13} \end{pmatrix}$ , $P = \begin{pmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{pmatrix}$ , $Q = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 1 & 1 \end{pmatrix}$ , 则 $B = (\quad)$ .
A. AQP
B. PAQ
C. QAP
D. APQ

(2) 设 A 是 $n(n \geqslant 3)$ 阶可逆方阵，则下列结论中正确的是 ( ).  
① $\left(A^{*}\right)^{-1} = \left(A^{-1}\right)^{*}$ ② $(kA)^{*} = k^{n-1}A^{*}(k \neq 0)$ ③ $\left(A^{*}\right)^{T} = \left(A^{T}\right)^{*}$ ④ $\left(A^{*}\right)^{*} = |A|^{n-2}A$ A. ①②

B. ②③

C. ③④

(3) 设 $A = \begin{pmatrix} 1 & 0 & 1 \\ 2 & 1 & 0 \\ -3 & 2 & -5 \end{pmatrix}$ , 则行列式 $\left|\left[(E - A)^*\right]^{-1}\right| = (\quad)$ .  
A. $\frac{1}{4}$ B. $-\frac{1}{4}$ C. $\frac{1}{16}$ D. $-\frac{1}{16}$ (4) 设矩阵 $A = \begin{pmatrix} 1 & 1 & 1 \\ 0 & 1 & 0 \\ 2 & k & 3 \\ k - 1 & 5 & 1 \end{pmatrix}$ 与 $B = \begin{pmatrix} 1 & 1 & 1 \\ 0 & 1 & -1 \\ 2 & 3 & k \\ 3 & 5 & 1 \end{pmatrix}$ 等价，则（）.
A. k=1    B. $k\neq1$ C. k=-1    D. $k\neq-1$ 

(5) 设 $A = \begin{pmatrix} a_{1} & a_{2} & a_{3} \\ b_{1} & b_{2} & b_{3} \\ c_{1} & c_{2} & c_{3} \end{pmatrix}, B = \begin{pmatrix} b_{1} & b_{3} & b_{2} \\ a_{1} & a_{3} & a_{2} \\ c_{1} + a_{1} & c_{3} + a_{3} & c_{2} + a_{2} \end{pmatrix}$ ，则（）.
A. $|A| = -|B|$ B. $2|A| = |B|$ C. $|A| = 2|B|$ D. $|A| = |B|$ 

(6) 设 $A=\begin{pmatrix}1&0&-1\\2&a&1\\1&2&1\end{pmatrix}$ ，B 是 3 阶矩阵，且 $r(B)=2, r(AB)=1, A^{*}$ 与 $B^{*}$ 分别是 A 与 B 的伴随矩阵，则下列选项中正确的是（）.
A. $r\left[\begin{pmatrix}A^{*}&O\\A&B\end{pmatrix}\right]=3$ B. $r\left[\begin{pmatrix}A&O\\O&B^{*}\end{pmatrix}\right]=3$ C. $r\left[\begin{pmatrix}A^{*}&B\\O&A\end{pmatrix}\right]=3$ D. $r\left[\begin{pmatrix}A&B^{*}\\O&B\end{pmatrix}\right]=3$ 

## 二、填空题

(1) 设 $\alpha=(1,2,3)^{T},\beta=\left(1,\frac{1}{2},\frac{1}{3}\right)^{T},A=\alpha\beta^{T}$ ，则 $A^{n}=$ ____.

(2) 设 $\alpha=(2,-1,3)^{T},\beta=(1,2,0)^{T},A=\alpha\beta^{T},E$ 是 3 阶单位矩阵，则 $(A+E)^{n}=$ ____.

(3) 设 $A = \begin{pmatrix} 1 & 0 & 1 \\ 0 & 2 & 0 \\ 1 & 0 & 1 \end{pmatrix}$ ，则 $A^{n} =$ ____ .

(4) 设 $A = \begin{pmatrix} 1 & 1 & 1 \\ 0 & 1 & 1 \\ 0 & 0 & -1 \end{pmatrix}$ ，则 $A^{18} =$ ____ .

(5) 设 $B = \begin{pmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}, A = P^{-1}BP$ , 则 $A^4 - 2B^2 =$ ____.

(6) 设 A 是 n 阶方阵, 且 $|A|=2$ , 将 A 的第 i 行与第 j 行互换得到 B, 则行列式 $\left|B^{-1}B^{*}B^{T}\right|=\underline{\quad}$ .

(7) 若 $A^n = O, n$ 为正整数，则 $(E - A)^{-1} = \underline{\quad}$ .

(8) 若 $A^{n}=E, n$ 为正整数，则 $(A^{*})^{n}=$ ____.

(9) 设方阵 A 满足 $A^{2}-3A-2E=O$ ，则 $A^{-1}=$ ____.

(10) 设 $\alpha=(k,0,\cdots,0,k)^{T}(k\neq0)$ ，且 $A=E-\alpha\alpha^{T},A^{-1}=E+\frac{1}{k}\alpha\alpha^{T}$ ，则 k= ____.

(11) 设 $\alpha, \beta, \gamma$ 均为 3 维列向量, $A = (\alpha, \beta, \gamma), |A| = 1$ , $B = (\alpha + \beta, \beta + \gamma, \beta + 2\gamma)$ , 则 $\left|(A^{-1} + B^{-1})^*\right| = \underline{\quad}$ .

## 三、解答题

(1) 设 $A = \begin{pmatrix} 2 & -1 & 3 \\ a & 1 & b \\ 4 & c & 6 \end{pmatrix}$ , 且 $BA = O, B$ 是 3 阶方阵, $r(B) > 1$ , 求 $A^n$ .

(2) 设 $\alpha, \beta$ 是 $n$ 维列向量，且 $\alpha^T \beta = 2$ ，证明: $A = E + \alpha \beta^T$ 可逆，并求 $A^{-1}$ .

(3) 设 $A^{-1} = \begin{pmatrix} 1 & 1 & 1 \\ 1 & 2 & 1 \\ 1 & 1 & 3 \end{pmatrix}$ , 求 $(A^{*})^{-1}$ .

(4) 设 $A = \begin{pmatrix} 1 & 0 & 0 \\ 2 & 3 & 0 \\ 0 & 4 & 5 \end{pmatrix}, B = (E + A)^{-1}(E - A)$ , 求 $\left[(E + B)^2\right]^{-1}$ .

(5) 已知方阵 $A, B, (A + B)$ 均可逆, 求 $\left(A^{-1} + B^{-1}\right)^{-1}$ .

(6) 设 $A$ 为 $2n + 1$ 阶正交矩阵, 且 $|A| = 1$ , 证明: $A - E$ 不可逆.

(7) 设 $n$ 阶方阵 $A, B$ ，满足 $A^2 = E, B^2 = E$ ，且 $|A| + |B| = 0$ ，证明: $A + B$ 不可逆.

(8) 设 $A = \begin{pmatrix} 1 & 0 & 1 \\ 0 & 2 & 0 \\ -1 & 0 & 1 \end{pmatrix}, AB + E = A^2 + B,$ 求 $B$ .

(9) 设 $A = \left( \begin{array}{ccc}\frac{1}{3} & 0 & 0\\ 0 & \frac{1}{4} & 0\\ 0 & 0 & \frac{1}{7} \end{array} \right),A^{-1}BA = 6A + BA,$ 求 $B$ 

(10) 设 $A = \begin{pmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}, B = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{pmatrix}, C = \begin{pmatrix} 1 & -4 & 3 \\ 2 & 0 & -1 \\ 1 & -2 & 0 \end{pmatrix}$ , 满足 $AXB = C$ , 求矩阵 $X$ .

(11) 设矩阵 A 满足 $A\begin{pmatrix}1 & 2 \\ 0 & 1\end{pmatrix} = \begin{pmatrix}2 & 1 \\ 3 & 2\end{pmatrix} A$ ，求矩阵 A.

## 综合题

## 一、选择题

(1) 设 $A=\begin{pmatrix}1&2&k\\1&k+1&1\\k&2&1\end{pmatrix}$ ，B 是 3 阶非零矩阵，且 AB=O，则（）.
A. 当 k=1 时, $r(B)=1$ B. 当 k=-3 时, $r(B)=1$ C. 当 k=1 时, $r(B)=2$ D. 当 k=-3 时, $r(B)=2$ 

(2) 设 $A = \begin{pmatrix} a & b & b \\ b & a & b \\ b & b & a \end{pmatrix} (a, b \text{ 均不为 } 0)$ ，且 $r(A^{*}) = 1$ ，则必有（）.
A. a = b
B. a = b 或 $a + 2b \neq 0$ C. $a + 2b = 0$ D. $a \neq b$ 且 $a + 2b \neq 0$ (3) 设 $A=\begin{pmatrix}a_{11}&a_{12}&a_{13}\\a_{21}&a_{22}&a_{23}\\a_{31}&a_{32}&a_{33}\end{pmatrix}, P=\begin{pmatrix}0&0&1\\0&1&0\\1&0&0\end{pmatrix}$ ，且 $P^{n}AP^{m}=A$ ，则正整数 n,m 可以为（）.
A. n=m=4 B. n=5,m=4 C. n=4,m=5 D. n=m=5

(4) 设 A, B 均为 n 阶矩阵，E 为 n 阶单位矩阵，矩阵 $\begin{pmatrix} O & A \\ B & E \end{pmatrix}$ ， $\begin{pmatrix} A & B \\ O & E \end{pmatrix}$ ， $\begin{pmatrix} A & AB \\ E & B \end{pmatrix}$ 的秩分别为 $r_{1}$ ， $r_{2}$ ， $r_{3}$ ，则下列选项中正确的是（）.
A. $r_{2} \geqslant r_{1} \geqslant r_{3}$ B. $r_{3} \geqslant r_{1} \geqslant r_{2}$ C. $r_{1} \geqslant r_{2} \geqslant r_{3}$ D. $r_{3} \geqslant r_{2} \geqslant r_{1}$ 

(5) 设 n 阶非零实矩阵 A 满足 $A^{T} + A = O, B$ 为 n 阶矩阵，矩阵 $\begin{pmatrix} A & E \\ -B & B \end{pmatrix}, \begin{pmatrix} A - E & O \\ A & AB \end{pmatrix}$ ， $\begin{pmatrix} A + E & O \\ B & A - E \end{pmatrix}$ 的秩依次为 $r_{1}, r_{2}, r_{3}$ ，则（）.

A. $r_{1} \geqslant r_{2} \geqslant r_{3}$ B. $r_{3} \geqslant r_{2} \geqslant r_{1}$ C. $r_{2} \geqslant r_{1} \geqslant r_{3}$ D. $r_{3} \geqslant r_{1} \geqslant r_{2}$ 

(6)下列选项中命题正确的是().

①若 A, B, C 均为 n 阶矩阵, 且 ABC = E, 则 BCA = CAB;

②若 A, B 均为 n 阶不可逆矩阵, 则 $A + B$ 必不可逆;

③若 A, B 均为 n 阶不可逆矩阵，则 AB 必不可逆；

④若 n 阶矩阵 A，B 满足 $(AB)^{2}=E$ ，则 $(BA)^{2}=E$ .
A. ①②③ B. ①③④ C. ②③④ D. ①②④

(7)单位矩阵经过若干次互换两行得到的矩阵称为置换矩阵, 设 $A$ 为 $n$ 阶置换矩阵, $A^{*}$ 为 $A$ 的伴随矩阵, 则下列说法中正确的是 ( ).

① $A^{T}$ 是置换矩阵; ② $A^{-1}$ 是置换矩阵;

③ $A^{*}$ 是置换矩阵; ④ $A^{-1} - A^{*} = O$ .

A. ①④ B. ②③ C. ①② D. ③④

## 二、填空题

(1) 设 A, B 是 n 阶方阵, $|A| = 2$ , $|B| = 3$ , $A^{*}$ , $B^{*}$ 分别是 A, B 的伴随矩阵, $C = \begin{pmatrix} A & O \\ O & B \end{pmatrix}$ , 则 C 的伴随矩阵 $C^{*} =$ ____.

(2) 设 $A$ 是 $n$ 阶可逆矩阵， $A$ 的每行元素之和均为 $k$ ，则 $A^{-1}$ 的每行元素之和均为 ____.

(3) 设 $A = \begin{pmatrix} 1 & -1 & -1 & -1 \\ -1 & 1 & -1 & -1 \\ -1 & -1 & 1 & -1 \\ -1 & -1 & -1 & 1 \end{pmatrix}$ , 则 $A^n (n \geqslant 1) =$ ____.

(4) 设 $A = \begin{pmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 0 \end{pmatrix}$ , 则 $(E + A)^{-1} =$ ____.

(5) 设 A, B 均为 n 阶可逆矩阵, 且 $AB = B^{-1}A^{-1}$ , 则 $r(E + BA) + r(E - BA) =$ ____.

(6) 设 A 是 3 阶非零矩阵, $A^{*}$ 为 A 的伴随矩阵, 若 $A^{*} + 2A = O$ , 则 $tr\left[(A^{2})^{-1}\right] =$ ____.

## 三、解答题

(1) 设 $A = \begin{pmatrix} 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 2 \\ 0 & 0 & 0 & 3 \\ 3 & 2 & 1 & 0 \end{pmatrix}$ , 求 $A^n (n \geqslant 1)$ .

(2) 设 $A = \begin{pmatrix} -1 & 1 & 1 & -1 \\ 1 & -1 & -1 & 1 \\ 1 & -1 & -1 & 1 \\ -1 & 1 & 1 & -1 \end{pmatrix}$ , 证明: $A^2 + 4A = O$ , 并求 $(E + A)^{-1}$ .

(3) 设 $A = \begin{pmatrix} 1 & 0 & 0 \\ 0 & -2 & 0 \\ 0 & 0 & 1 \end{pmatrix}$ , 且 $A^{*}BA = 2BA - 8E$ , 求 $B$ .

(4) 设矩阵 $X$ 满足 $\begin{pmatrix} 1 & 0 & 1 \\ 2 & 1 & -1 \\ -1 & -1 & 2 \end{pmatrix} X = \begin{pmatrix} 0 & 1 \\ 2 & 0 \\ -2 & 1 \end{pmatrix}$ , 求 $X$ .

## 拓展题

解答题

(1) 设 $A = \begin{pmatrix} 3 & 2 & 2 \\ 0 & 1 & 1 \\ 0 & 0 & 3 \end{pmatrix}, B = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & -1 \end{pmatrix}$ , 若矩阵 $X$ 满足 $AX + 2B = BA + 2X$ , 求 $X^2$ .

(2) 设分块矩阵 $P = \begin{pmatrix} A & C \\ O & B \end{pmatrix}$ 为正交矩阵, A, B 分别是 m 阶和 n 阶方阵, 证明: A 与 B 是正交矩阵.

## 第十二章 向量

## 基础题

## 一、选择题

(1) 若 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性相关， $\alpha_{2}, \alpha_{3}, \alpha_{4}$ 线性无关，则（）.
A. $\alpha_{1}$ 可由 $\alpha_{2}, \alpha_{3}$ 线性表示
B. $\alpha_{4}$ 可由 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性表示
C. $\alpha_{4}$ 可由 $\alpha_{1}, \alpha_{3}$ 线性表示
D. $\alpha_{4}$ 可由 $\alpha_{1}, \alpha_{2}$ 线性表示

(2) 向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 线性无关等价于 ( ).  
A. 存在一组不全为 0 的数, 使其线性组合不为 0  
B. 存在一个向量不能由其他向量线性表示  
C. 任何一个向量均不能由其他向量线性表示  
D. 其中任意两个向量线性无关

(3) 设向量组 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 线性无关，则下列向量组线性无关的是（）.
A. $\alpha_{1}+\alpha_{2},\alpha_{2}+\alpha_{3},\alpha_{3}+\alpha_{4},\alpha_{4}+\alpha_{1}$ B. $\alpha_{1}+\alpha_{2},\alpha_{2}+\alpha_{3},\alpha_{3}+\alpha_{4},\alpha_{4}-\alpha_{1}$ C. $\alpha_{1}+\alpha_{2},\alpha_{2}-\alpha_{3},\alpha_{3}+\alpha_{4},\alpha_{4}-\alpha_{1}$ D. $\alpha_{1}-\alpha_{2},\alpha_{2}-\alpha_{3},\alpha_{3}-\alpha_{4},\alpha_{4}-\alpha_{1}$ (4) 设向量组 $(I)\beta_{1}, \beta_{2}, \cdots, \beta_{t}, (II)\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ ，则下列命题：
①若向量组(I)可由(II)线性表示，且s<t，则必有(I)线性相关，
②若向量组(II)可由(I)线性表示，且s<t，则必有(I)线性相关，
③若向量组(I)可由(II)线性表示，且(I)线性无关，则必有 $s\geqslant t$ ④若向量组(II)可由(I)线性表示，且(I)线性无关，则必有 $s\geqslant t$ ，正确的是()。
A. ①④ B. ①③ C. ②③ D. ②④

(5) 设 $\alpha_{1}=(a_{1},a_{2},a_{3})^{T},\alpha_{2}=(b_{1},b_{2},b_{3})^{T},\alpha_{3}=(c_{1},c_{2},c_{3})^{T}$ ，其中 $a_{i}^{2}+b_{i}^{2}\neq0(i=1,2,3)$ ，则 3 条直线 $a_{i}x+b_{i}y+c_{i}=0(i=1,2,3)$ 恰好仅交于一点的充分必要条件是（）.
A. $r(\alpha_{1},\alpha_{2},\alpha_{3})=3$ B. $r(\alpha_{1},\alpha_{2},\alpha_{3})=1$ C. $r(\alpha_{1},\alpha_{2},\alpha_{3})=r(\alpha_{1},\alpha_{2})$ D. $r(\alpha_{1},\alpha_{2},\alpha_{3})=r(\alpha_{1},\alpha_{2})=2$ 

(6) 设 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 均为 3 维向量, 则对任意常数 k 和 $\mu$ , 向量组 $\alpha_{1} + k\alpha_{3}, \alpha_{2} + \mu\alpha_{3}$ 线性无关是向量组 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关的 ( ). A. 充分必要条件 B. 充分非必要条件 C. 必要非充分条件 D. 既非充分又非必要条件

## 二、填空题

(1) 已知向量组 $\alpha_{1}=(1,2,3)^{T},\alpha_{2}=(2,-1,1)^{T},\alpha_{3}=(-2,k,4)^{T}$ 线性相关，则 k= ____.

(2) 已知 3 维线性空间的一组基为 $\alpha_{1} = (1,1,0), \alpha_{2} = (1,0,1), \alpha_{3} = (0,1,1)$ , 则向量 $\beta = (2,0,0)$ 在上述基下的坐标为 ____.

(3) 设 3 维向量空间的两组基分别为 $\alpha_{1} = (1,2,3)^{T}, \alpha_{2} = (2,3,1)^{T}, \alpha_{3} = (3,1,2)^{T}; \beta_{1} = (-1, -1,2)^{T}, \beta_{2} = (-1,2, -1)^{T}, \beta_{3} = (3,1,2)^{T}$ , 则从 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 到 $\beta_{1}, \beta_{2}, \beta_{3}$ 的过渡矩阵为 ____.

## 三、解答题

(1) 设向量组 $\alpha_{1}=(1,1,1,2)^{T},\alpha_{2}=(3,a+4,2a+5,a+7)^{T},\alpha_{3}=(4,6,8,10)^{T},\alpha_{4}=(2,3,2a+3,5)^{T},\alpha=(0,1,3,b)^{T}.$ 

(I) 求向量组 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 的秩及其一个极大线性无关组;

(II) 若 $\alpha$ 不能由 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 线性表示, 求 $a, b$ 的取值.

(2) 设向量组 $\alpha_{1}=(0,4,2)^{T},\alpha_{2}=(1,1,0)^{T},\alpha_{3}=(-2,4,3)^{T},\alpha_{4}=(-1,1,1)^{T}$ ，求 $\alpha_{1},\alpha_{2},\alpha_{3},\alpha_{4}$ 的一个极大线性无关组，并将其余向量用极大线性无关组线性表示.

(3) 设 $\alpha_{1}=(1,0,2,3)^{T},\alpha_{2}=(1,1,3,5)^{T},\alpha_{3}=(1,-1,a,1)^{T},\beta=(1,b,4,7)^{T}$ ，问 a,b 为何值时， $\beta$ 不能由 $\alpha_{1},\alpha_{2},\alpha_{3}$ 线性表示；a,b 为何值时， $\beta$ 可由 $\alpha_{1},\alpha_{2},\alpha_{3}$ 线性表示，并写出表达式.

(4) 设向量组 $\alpha_{1}=(1,2,-3)^{T},\alpha_{2}=(3,0,1)^{T},\alpha_{3}=(9,6,-7)^{T}$ 与向量组 $\beta_{1}=(0,1,-1)^{T},\beta_{2}=(k,2,1)^{T},\beta_{3}=(\mu,1,0)^{T}$ 有相同的秩，且 $\beta_{3}$ 可由 $\alpha_{1},\alpha_{2},\alpha_{3}$ 线性表示，求 $k,\mu$ 的值.

(5) 设向量组 $(I): \alpha_{1} = (1,3,0,5)^{T}, \alpha_{2} = (1,2,1,4)^{T}, \alpha_{3} = (1,1,2,3)^{T}; (II): \beta_{1} = (1, -3,6, -1)^{T}, \beta_{2} = (a,0,b,2)^{T}$ . 若向量组 $(I)$ 与 $(II)$ 等价, 求 $a, b$ 的值.

(6) 设向量组 $(I)\alpha_{1},\alpha_{2},\alpha_{3},(II)\alpha_{1},\alpha_{2},\alpha_{3},\alpha_{4},(III)\alpha_{1},\alpha_{2},\alpha_{3},\alpha_{5}$ ，且 $r(I)=r(II)=3, r(III)=4$ ，证明：向量组 $\alpha_{1},\alpha_{2},\alpha_{3},\alpha_{5}-\alpha_{4}$ 的秩为 4.

(7) 设 A 是 3 阶方阵, $\alpha_{1}, \alpha_{2}$ 为 A 的分别属于特征值 -2, 1 的特征向量, 且 $A\alpha_{3} = \alpha_{2} + \alpha_{3}$ , 证明: $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关.

(8) 设矩阵 $A_{5 \times 4}$ 的秩为 $2, \alpha_{1} = (1, 1, 2, 3)^{T}, \alpha_{2} = (-1, 1, 4, -1)^{T}, \alpha_{3} = (5, -1, -8, 9)^{T}$ 是方程组 $Ax = 0$ 的解向量，求 $Ax = 0$ 的解空间的一组标准正交基.

## 综合题

## 一、选择题

(1) 设 A 是 $m \times n$ 矩阵， $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{t}$ 是 n 维列向量，向量组 $(I)\alpha_{1}, \alpha_{2}, \cdots, \alpha_{t}, (-A\alpha_{1}, A\alpha_{2}, \cdots, A\alpha_{t}$ ，则下列选项中正确的是（）.
A. 若 $(I)$ 线性无关，则 $(II)$ 线性无关 B. 若 $(II)$ 线性相关，则 $(I)$ 线性相关 C. 若 $(II)$ 线性无关，则 $(I)$ 线性无关 D. $(I)$ 与 $(II)$ 具有相同的线性相关性

(2) 设三维列向量 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性相关， $\alpha_{2}, \alpha_{3}, \alpha_{4}$ 线性无关，记 $(\beta_{1}, \beta_{2}, \beta_{3}) = (\alpha_{1}, \alpha_{2}, \alpha_{3}) A_{3 \times 3}$ ， $(\gamma_{1}, \gamma_{2}, \gamma_{3}) = (\alpha_{2}, \alpha_{3}, \alpha_{4}) B_{3 \times 3}$ ，则（）.
A. 存在矩阵 $A_{3\times3}$ ，使得 $\beta_{1}, \beta_{2}, \beta_{3}$ 线性无关 B. 不存在矩阵 $A_{3\times3}$ ，使得 $\beta_{1}, \beta_{2}, \beta_{3}$ 线性相关 C. 存在矩阵 $B_{3\times3}$ ，使得 $\gamma_{1}, \gamma_{2}, \gamma_{3}$ 线性无关 D. 不存在矩阵 $B_{3\times3}$ ，使得 $\gamma_{1}, \gamma_{2}, \gamma_{3}$ 线性相关

(3) 设向量 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 满足 $k_{1}\alpha_{1} + k_{2}\alpha_{2} + k_{3}\alpha_{3} = 0, k_{1}, k_{2}, k_{3}$ 为常数，且 $k_{1}k_{3} \neq 0$ ，则（）.
A. $\alpha_{1}$ 与 $\alpha_{3}$ 等价
B. $\alpha_{1}, \alpha_{2}$ 与 $\alpha_{1}, \alpha_{3}$ 等价
C. $\alpha_{1}, \alpha_{2}$ 与 $\alpha_{2}, \alpha_{3}$ 等价
D. $\alpha_{1}, \alpha_{3}$ 与 $\alpha_{2}, \alpha_{3}$ 等价

(4) 设 n 维向量组 $(I)\alpha_{1}, \alpha_{2}, \cdots, \alpha_{k} (k < n)$ 线性无关，则 n 维向量组 $(II)\beta_{1}, \beta_{2}, \cdots, \beta_{k}$ 也线性无关的充分必要条件是（）.

A. $\beta_{1}, \beta_{2}, \cdots, \beta_{k}$ 可由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{k}$ 线性表示

B. $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{k}$ 可由 $\beta_{1}, \beta_{2}, \cdots, \beta_{k}$ 线性表示

C. 向量组 $(I)$ 与向量组 $(II)$ 等价

D. 矩阵 $(\alpha_{1}, \alpha_{2}, \cdots, \alpha_{k})$ 与 $(\beta_{1}, \beta_{2}, \cdots, \beta_{k})$ 等价

(5) 设 4 维列向量 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关， $\beta_{i} (i = 1, 2, 3, 4)$ 为非零列向量，且 $\beta_{i}$ 与 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 均正交，则 $r(\beta_{1}, \beta_{2}, \beta_{3}, \beta_{4}) = (\quad)$ .

A. 1 B. 2 C. 3 D. 4

(6) 设 A, B 均是 $m \times n$ 矩阵，则 Ax = 0 与 Bx = 0 同解的充分必要条件是 ( ).  
A. A, B 的列向量组等价  
B. A, B 的行向量组等价  
C. A, B 是等价矩阵  
D. $A^{T}x = 0$ 与 $B^{T}x = 0$ 同解(7) 设 A, B 为 n 阶矩阵，P, Q 为 n 阶可逆矩阵，则下列选项中错误的是（）.
A. 若 A = BQ，则 B 的列向量组与 A 的列向量组等价
B. 若 A = PB，则 B 的行向量组与 A 的行向量组等价
C. 若 A = PBQ，则矩阵 A 与 B 等价
D. 若 A = PBQ，则 B 的行 (列) 向量组与 A 的行 (列) 向量组等价

(8) 设 A, B 分别为 $m \times n$ 与 $n \times s$ 矩阵，且 $r(A) = n$ ，则下列选项中正确的是（）.
A. AB 的列向量组与 B 的列向量组等价
B. AB 的行向量组与 B 的行向量组等价
C. AB 的列向量组与 A 的列向量组等价
D. AB 的行向量组与 A 的行向量组等价

## 二、填空题

(1) 设向量组 $\alpha_{1}=(1,k+2,3)^{T},\alpha_{2}=(2,-1,1)^{T},\alpha_{3}=(k-1,1,-1)^{T}$ 线性相关,但任意两个向量线性无关,则 k= ____.

(2) 设向量组 $(I)\alpha_{1} = (1,1,2)^{T},\alpha_{2} = (2,3,3)^{T};(II)\beta_{1} = (2,3,5)^{T},\beta_{2} = (-1,0,1)^{T}$ , 则既可由 $(I)$ 线性表示, 又可由 $(II)$ 线性表示的非零列向量为 ____.

(3) 设 $\alpha_{1} = (1,1,1)^{T}, \alpha_{2} = (1,0,-1)^{T}, \alpha_{3} = (1,0,1)^{T}$ 与 $\beta_{1} = (1,2,1)^{T}, \beta_{2} = (3,3,3)^{T}, \beta_{3} = (2,4,3)^{T}$ 是 $R^{3}$ 的两组基，则在两组基下有相同坐标的向量为 ____.

## 三、解答题

(1) 设 $A = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 1 & 2 & 0 & 0 \\ 2 & 4 & 3 & -3 \end{pmatrix} = (\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}), B = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 2 & 0 & 0 \\ 0 & 0 & 3 & 0 \end{pmatrix}$ . 求:

(I) 向量组 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 的一个极大线性无关组;

(II) 可逆矩阵 $P_{3 \times 3}, Q_{4 \times 4}$ ，使得 PAQ = B.

(2) 设向量组 $\alpha_{1} = (1,0,1)^{T}, \alpha_{2} = (0,1,1)^{T}, \alpha_{3} = (1,3,5)^{T}$ 不能由向量组 $\beta_{1} = (1,1,1)^{T}, \beta_{2} = (1,2,3)^{T}, \beta_{3} = (3,4,a)^{T}$ 线性表示，求 $a$ 的值，并将 $\beta_{1}, \beta_{2}, \beta_{3}$ 用 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性表示.

(3) 设 $A$ 是 3 阶矩阵, $\alpha_{i} (\mathrm{i} = 1,2,3)$ 是 3 维非零列向量, 且 $A\alpha_{i} = \mathrm{i}\alpha_{i} (\mathrm{i} = 1,2,3), \alpha = \alpha_{1} + \alpha_{2} + \alpha_{3}$ , 证明: $\alpha, A\alpha, A^{2}\alpha$ 线性无关.

(4) 设 $A = (\alpha_{1}, \alpha_{2}, \alpha_{3})$ ，其中 $\alpha_{1} = (1,0,1)^{T}, \alpha_{2} = (1,1,2)^{T}, \alpha_{3} = (1,2,a)^{T}, B = (\beta_{1}, \beta_{2})$ ，其中 $\beta_{1} = (-1,2,1)^{T}, \beta_{2} = (1,0,b)^{T}$ . 问：

(I)a,b 为何值时, $\beta_{1},\beta_{2}$ 不能同时由 $\alpha_{1},\alpha_{2},\alpha_{3}$ 线性表示?

(II)a,b 为何值时, $\beta_{1},\beta_{2}$ 可同时由 $\alpha_{1},\alpha_{2},\alpha_{3}$ 线性表示? 并求表达式.

(5) 设 $A = (\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}), \alpha_{1} = \begin{pmatrix} 1 \\ 0 \\ 0 \\ 0 \end{pmatrix}, \alpha_{2} = \begin{pmatrix} 1 \\ 1 \\ 1 \\ 1 \end{pmatrix}, \alpha_{3} = \begin{pmatrix} 0 \\ 1 \\ 1 \\ 1 \end{pmatrix}, \alpha_{4} = \begin{pmatrix} 0 \\ -1 \\ -1 \\ -1 \end{pmatrix}$ .

(I) 证明: $\alpha_{1},\alpha_{2}$ 是 $\alpha_{1},\alpha_{2},\alpha_{3},\alpha_{4}$ 的极大线性无关组.

(II) 记 $G = (\alpha_{1}, \alpha_{2})$ , 求矩阵 $H$ , 使得 $A = GH$ , 并求 $A^{8}$ .

(6) 设 $A = (\alpha_{1}, \alpha_{2}, \alpha_{3})$ 为 3 阶矩阵, 交换 $A$ 的第 1,2 行, 再交换 $A$ 的第 2,3 列得 $B = \begin{pmatrix} 0 & -1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & -1 \end{pmatrix}$ .

(I) 求 A;

(II) 记 $\beta_{1} = \alpha_{1}, \beta_{2} = \alpha_{2} - k\beta_{1}, \beta_{3} = \alpha_{3} - l_{1}\beta_{1} - l_{2}\beta_{2}$ , 若 $\beta_{1}, \beta_{2}, \beta_{3}$ 两两正交, 求 $k, l_{1}, l_{2}$ ;

(III) 求正交矩阵 Q 及上三角矩阵 T，使得 A = QT.

(7) 设 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 与 $\beta_{1}, \beta_{2}, \beta_{3}$ 是 3 维向量空间的两组基，若向量 $\gamma$ 在这两组基下的坐标分别为 $(x_{1}, x_{2}, x_{3})$ 与 $(y_{1}, y_{2}, y_{3})$ ，且 $x_{1} = y_{1}, x_{2} = -y_{1} + y_{2}, x_{3} = -y_{2} + y_{3}$ .

(I) 求由基 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 到基 $\beta_{1}, \beta_{2}, \beta_{3}$ 的过渡矩阵;

(II) 若 $\alpha_{1} = (1,2,3)^{T},\alpha_{2} = (2,3,1)^{T},\alpha_{3} = (3,1,2)^{T}$ , 求 $\beta_{1},\beta_{2},\beta_{3}$ .

## 拓展题

## 解答题

设 $\alpha_{1},\alpha_{2},\cdots,\alpha_{n}$ 为 n 维向量空间 $R^{n}$ 的一组基，且 $\beta_{1}=\alpha_{1},\beta_{2}=\alpha_{1}+\alpha_{2},\cdots,\beta_{n}=\alpha_{1}+\alpha_{2}+\cdots+\alpha_{n}.$ 

(I) 证明: $\beta_{1}, \beta_{2}, \cdots, \beta_{n}$ 也是 $R^{n}$ 的一组基, 并写出由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 到 $\beta_{1}, \beta_{2}, \cdots, \beta_{n}$ 的过渡矩阵 $P$ ;

(II) 设向量 $\alpha \in R^{n}, \alpha$ 在基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 下的坐标为 $(n, n-1, \cdots, 2, 1)^{T}$ ，求 $\alpha$ 在基 $\beta_{1}, \beta_{2}, \cdots, \beta_{n}$ 下的坐标.

## 第十三章 线性方程组

## 基础题

## 一、选择题

(1) 已知 $\eta_1, \eta_2$ 是非齐次线性方程组 $Ax = b$ 的两个不同解, $\xi_1, \xi_2$ 是对应齐次线性方程组 $Ax = 0$ 的基础解系, $k_1, k_2$ 为任意常数, 则 $Ax = b$ 的通解为 ( ).  
A. $k_1\xi_1 + k_2(\xi_1 + \xi_2) + \frac{\eta_1 - \eta_2}{2}$ B. $k_1\xi_1 + k_2(\xi_1 - \xi_2) + \frac{\eta_1 + \eta_2}{2}$ C. $k_1\xi_1 + k_2(\eta_1 + \eta_2) + \frac{\eta_1 - \eta_2}{2}$ D. $k_1\xi_1 + k_2(\eta_1 - \eta_2) + \frac{\eta_1 + \eta_2}{2}$ 

(2) 设 A 是 n 阶矩阵，对方程组 $(I)Ax = 0$ 和 $(II)A^{T}Ax = 0$ ，必有（）.
A. (II) 的解是 (I) 的解，(I) 的解也是 (II) 的解
B. (II) 的解是 (I) 的解,但 (I) 的解不是 (II) 的解
C. (I) 的解不是 (II) 的解, (II) 的解也不是 (I) 的解
D. (I) 的解是 (II) 的解，但 (II) 的解不是 (I) 的解

(3) 设 $A$ 是 $n$ 阶矩阵，若对任意的 $n$ 维列向量 $\alpha$ ，有 $A^{*}\alpha = 0$ ，则 $Ax = 0$ 的基础解系所含解向量的个数 $k$ 满足（）.

A. $k = 0$ B. $k = 1$ C. $k > 1$ D. $k = n$ 

(4) 设方程组 $\left\{\begin{aligned}\lambda x_{1}+x_{2}+\lambda^{2}x_{3}=0,\\ x_{1}+\lambda x_{2}+x_{3}=0,\\ x_{1}+x_{2}+\lambda x_{3}=0\end{aligned}\right.$ 的系数矩阵为 A，若存在 3 阶矩阵 $B\neq O$ ，使得 AB=O，则必有（）.
A. $\lambda=-2$ 且 $|B|=0$ B. $\lambda=-2$ 且 $|B|\neq0$ C. $\lambda=1$ 且 $|B|=0$ D. $\lambda=1$ 且 $|B|\neq0$ 

(5) 设 $B=\begin{pmatrix}1&2&-1\\2&a&4\\3&5&a\end{pmatrix}(a>0)$ , A 是 3 阶非零矩阵, 且 $BA^{T}=O, k_{1}, k_{2}$ 为任意常数, 则方程组 AX=0 的通解为 ( ).  
A. $k_{1}\begin{pmatrix}1\\0\\0\end{pmatrix}$ B. $k_{1}\begin{pmatrix}1\\2\\-1\end{pmatrix}+k_{2}\begin{pmatrix}0\\-1\\6\end{pmatrix}$ C. $k_{1}\begin{pmatrix}1\\2\\3\end{pmatrix}$ D. $k_{1}\begin{pmatrix}1\\2\\3\end{pmatrix}+k_{2}\begin{pmatrix}0\\1\\1\end{pmatrix}$ 

(6) 设矩阵 $A_{m \times n}, B_{n \times m}$ ，则（）.
A. 当 m > n 时, AB 必可逆
B. 当 m > n 时, 必有 $|AB| = 0$ C. 当 n > m 时, 必有 $r(AB) < m$ D. 当 n > m 时, ABx = 0 必有唯一解(7) 设矩阵 $A_{m \times n}, B_{n \times m}$ 满足 AB = E, 其中 E 是单位矩阵, $\alpha$ 与 $\beta$ 为非零列向量, 则下列选项中正确的是 ( ).  
A. 方程组 AX = $\alpha$ 有唯一解, 方程组 BX = $\beta$ 有唯一解  
B. 方程组 AX = $\alpha$ 有无穷多解, 方程组 BX = $\beta$ 有无穷多解  
C. 方程组 AX = 0 仅有零解, 方程组 BX = $\beta$ 有解  
D. 方程组 AX = $\alpha$ 有解, 方程组 BX = 0 仅有零解

(8) 设 $A^{T} = (\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n-1})$ 是 $n \times (n-1)$ 矩阵， $r(A^{T}) = n - 1, \beta_{1}, \beta_{2}$ 是与 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n-1}$ 均正交的 n 维列向量， $\beta_{1} \neq \beta_{2}$ ，k 是任意常数，则方程组 AX = 0 的通解为（）.
A. $k\beta_{1}$ B. $k\beta_{2}$ C. $k(\beta_{1}+\beta_{2})$ D. $k(\beta_{1}-\beta_{2})$ 

(9) 设 A 是 $m \times s$ 矩阵，B 是 $s \times n$ 矩阵，则方程组 ABX = 0 与 BX = 0 同解的充分必要条件是（）.
A. $r(A)=s$ B. $r(AB)=r(B)$ C. $r(A)=r(B)$ D. $r(A)=m$ 

(10) 设 A 为 3 阶矩阵, $\alpha_{1}=(1,2,-2)^{T},\alpha_{2}=(2,1,-1)^{T},\alpha_{3}=(1,1,a)^{T}(a\neq-1)$ 是非齐次线性方程组 AX=b 的三个解, $A^{*}$ 是 A 的伴随矩阵, 则 ( ).  
A. AX=0 与 $A^{*}X=0$ 同解  
B. $A^{*}X=0$ 的解均是 AX=0 的解, 但二者不同解  
C. AX=0 的解均是 $A^{*}X=0$ 的解, 但二者不同解  
D. AX=0 与 $A^{*}X=0$ 没有非零公共解

(11) 设有矩阵 $A_{n \times s}, B_{s \times n}$ , 且 $r(A) = s, r(B) = n, E_{n \times n}$ 为单位矩阵, 则下列齐次线性方程组中有非零解的是 ( ).  
A. $\begin{pmatrix} AB & O \\ E & A \end{pmatrix} X = 0$ B. $\begin{pmatrix} AB & O \\ E & B \end{pmatrix} X = 0$ C. $\begin{pmatrix} A & E \\ O & AB \end{pmatrix} X = 0$ D. $\begin{pmatrix} A & AB \\ E & B \end{pmatrix} X = 0$ 

## 二、填空题

(1) 设方程组 $\left\{\begin{aligned}x_{1}+2x_{2}+x_{3}=3,\\ 2x_{1}+(k+4)x_{2}-5x_{3}=6,\text{有无穷多解，则}k= \\ -x_{1}-2x_{2}+kx_{3}=-3\end{aligned}\right.$ 

(2) 设 $A = \begin{pmatrix} 1 & 2 & 1 \\ 2 & 3 & a + 2 \\ 1 & a & -2 \end{pmatrix}, \beta_{1} = (1, 3, 4)^{T}, \beta_{2} = (0, 1, 2)^{T}$ ，若方程组 $Ax = \beta_{1}$ 有解，且 $Ax = \beta_{2}$ 无解，则 a = ____.

## 三、解答题

(1) 求方程组 $\left\{\begin{aligned}&2x_{1}-x_{2}+4x_{3}-3x_{4}=-4,\\ &x_{1}+x_{3}-x_{4}=-3,\\ &3x_{1}+x_{2}+x_{3}=1,\\ &7x_{1}+7x_{3}-3x_{4}=3\end{aligned}\right.$ 的通解.

(2) 设方程组 $\left\{\begin{aligned}&2x_{1}+\lambda x_{2}-x_{3}=1,\\ &\lambda x_{1}-x_{2}+x_{3}=2,\\ &4x_{1}+5x_{2}-5x_{3}=-1,\end{aligned}\right.$ 问 $\lambda$ 为何值时，方程组无解、有唯一解、有无穷多解？当有无穷多解时，求其通解.

(3) 设有方程组① $\left\{\begin{aligned}x_{1}+x_{2}&=0,\\ x_{2}-x_{4}&=0\end{aligned}\right.$ 与方程组② $\left\{\begin{aligned}x_{1}-x_{2}+x_{3}&=0,\\ x_{2}-x_{3}+x_{4}&=0.\end{aligned}\right.$ 求:

(I) 方程组①与②的基础解系;

(Ⅱ) 方程组①与②的非零公共解.

(4) 设有方程组 $(I)\left\{\begin{aligned}x_{1}+x_{2}&=0,\\ x_{2}-x_{4}&=0,\end{aligned}\right.$ $(II)Ax=0$ ，其中 $(II)$ 的基础解系为 $\alpha_{1}=(-1,2,2,1)^{T}$ ， $\alpha_{2}=(0,-1,-1,0)^{T}$ , 求方程组 $(I)$ 与 $(II)$ 的非零公共解.

(5) 设有方程组

$$
① \left\{ \begin{array}{l} x _ {1} - x _ {4} = - 2, \\ x _ {2} - x _ {4} = - 4, \\ - 4 x _ {2} - x _ {3} + 6 x _ {4} = 2 1, \end{array} \right. ② \left\{ \begin{array}{l} x _ {1} + a x _ {2} - x _ {3} - x _ {4} = - 5, \\ b x _ {2} - x _ {3} - 2 x _ {4} = - 1 1, \\ x _ {3} - 2 x _ {4} = - c + 1. \end{array} \right.
$$

(I) 求方程组①的通解;

(II) 当 a, b, c 为何值时, 方程组①与②同解.

(6) 设 $n$ 阶矩阵 $A$ 满足 $|A| = 0, A_{ij}$ 为 $|A|$ 的元素 $a_{ij}$ 对应的代数余子式, 且 $A_{11} \neq 0$ , 求方程组 $A^{*}x = 0$ 的基础解系和通解.

(7) 已知 $4 \times 3$ 矩阵 $A = (\alpha_{1}, \alpha_{2}, \alpha_{3})$ , 非齐次线性方程组 $Ax = \beta$ 的通解为 $(1, 2, -1)^{T} + k(1, -2, 3)^{T}$ , $k$ 为任意常数, 令 $B = (\alpha_{1}, \alpha_{2}, \alpha_{3}, \beta + \alpha_{3})$ , 求方程组 $By = \alpha_{1} - \alpha_{2}$ 的通解.

## 综合题

## 一、选择题

(1) 设 $y = f(x)$ 是连续函数，点 $P_{i}(x_{i}, y_{i}) (i=1,2,3)$ 为曲线 $y = f(x)$ 上三个不同点，矩阵 A = $\begin{pmatrix}x_{1}&y_{1}&1\\x_{2}&y_{2}&1\\x_{3}&y_{3}&1\end{pmatrix}$ ，则（）.
A. $r(A)=1$ B. $r(A)=3$ C. $r(A)=2$ 或 $r(A)=3$ D. $r(A)=1$ 或 $r(A)=2$ 

(2) 设三个平面的方程为 $x = y + bz, y = az + x, z = bx + ay$ ，则这三个平面经过同一直线的充分必要条件是（）.

A. $a^2 + b^2 = 1$ B. $a^2 - b^2 = 0$ C. $a + b = 0$ D. $a + b = 1$ 

(3) 设 A 是 $m \times n$ 矩阵，则非齐次线性方程组 Ax = b 有无穷多解的充分必要条件是 ( ).  
A. $r(A:b) < n$ B. Ax = 0 有非零解
C. Ax = b 有两个不同解
D. A 的列向量组线性相关

(4) 设三个不同平面的方程为 $a_{i1}x + a_{i2}y + a_{i3}z = b_i(i = 1,2,3)$ 相交于一条直线, 三个平面方程组成方程组的系数矩阵和增广矩阵分别记为 $A$ 和 $\overline{A}$ , 则 ( ).

$$
r (A) = 2, r (\overline {{A}}) = 2 \quad \text {B.} r (A) = 2, r (\overline {{A}}) = 3 \quad \text {C.} r (A) = 1, r (\overline {{A}}) = 2 \quad \text {D.} r (A) = 1, r (\overline {{A}}) = 1
$$

(5) 设 $A^{T} = (\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n-1})$ 是 $n \times (n-1)$ 矩阵, $r(A^{T}) = n - 1, \beta_{1}, \beta_{2}$ 是与 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n-1}$ 都正交的两个不同的 n 维列向量, k 是任意常数, 则方程组 Ax = 0 的通解为 ( ).  
A. $k(\beta_{1} - \beta_{2})$ B. $k(\beta_{1} + \beta_{2})$ C. $k\beta_{1}$ D. $k\beta_{2}$ 

(6) 设 n 维实列向量 $\alpha$ 满足 $\alpha^{T}\alpha=2, A, B$ 均为 n 阶矩阵, E 为 n 阶单位矩阵, 且 $A(E-2\alpha\alpha^{T})=B$ , 则 ( ).  
A. 方程组 BX=0 与方程组 $(E-2\alpha\alpha^{T})X=0$ 同解  
B. 方程组 $B^{T}X=0$ 与方程组 $(E-2\alpha\alpha^{T})X=0$ 同解  
C. 方程组 BX=0 与方程组 AX=0 同解  
D. 方程组 $B^{T}X=0$ 与方程组 $A^{T}X=0$ 同解

(7) 设 A 是 n 阶实对称矩阵，B 是 n 阶实矩阵, 若对任意 n 维非零列向量 $\alpha$ ，都有 $\alpha^{T}(AB + B^{T}A)\alpha > 0$ ，则下列选项中正确的是 ( ).

A. 方程组 $ABX = \alpha$ 有无穷多解

B. 方程组 $ABX = \alpha$ 无解

C. 方程组 $AX = \alpha$ 有唯一解

D. 方程组 $AX = \alpha$ 无解

(8) 设 A, B 均为 n 阶矩阵, $\alpha, \beta$ 均为 n 维列向量. 若 $\alpha$ 可由 A 的列向量线性表示, $(\alpha^{T}, \beta^{T})$ 不能由 $(A^{T}, B^{T})$ 的行向量线性表示, 则下列结论中正确的是 ( ).  
A. $r(B, \beta) = r(B)$ B. $r(B, \beta) = r(B) + 1$ C. $r\begin{pmatrix} A^{T} & B^{T} \\ \alpha^{T} & \beta^{T} \end{pmatrix} = r(A^{T}, B^{T}) + 1$ D. $r[(A, \alpha), B^{T}] = r\left[(A^{T}, B^{T})\binom{A}{B}\right]$ 

(9) 设 $f(x)$ 二阶可导, $f''(x) \neq 0$ , $(a, f(a)), (b, f(b)), (c, f(c))$ 为曲线 $y = f(x)$ 上三个不同的点, $\Pi_{1}: x + ay + f(a)z = f(b)$ , $\Pi_{2}: x + by + f(b)z = f(c)$ , $\Pi_{3}: x + cy + f(c)z = f(a)$ 为三个平面, 则 ( ). A. 三个平面交于一点 B. 三个平面交于一条直线 C. 三个平面相互平行 D. 三个平面两两相交, 且交线互相平行

(10) 设 A 是 $m \times n$ 矩阵, 则非齐次线性方程组 AX = b 有解的充分必要条件是 ( ) .
A. $r(A) = r(A^{T}) = m$ B. $r(A) = r(A^{T}) = n$ C. $r(A^{T}) = r\binom{A^{T}}{b^{T}} = m$ D. $A^{T}X = 0$ 与 $\binom{A^{T}}{b^{T}}X = 0$ 同解

## 二、填空题

(1) 设 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \beta$ 均为三维列向量, $A = (\beta - \alpha_{1} - 2\alpha_{2} - 3\alpha_{3}, \alpha_{1}, \alpha_{2}, \alpha_{3})$ , 则方程组 $Ax = \beta$ 的一个特解为 ____.

(2) 设 $A = \left(a_{ij}\right)_{3 \times 3}$ 为实矩阵，且 $A_{ij} = a_{ij} (\mathrm{i}, j = 1, 2, 3)$ ，其中 $A_{ij}$ 为 $a_{ij}$ 的代数余子式， $a_{33} = 1, |A| = 1$ ，则方程组 $A\begin{pmatrix} x_1 \\ x_2 \\ x_3 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix}$ 的解为 ____.

(3) 设 A 是 2 阶矩阵, 线性方程组 $AX=\begin{pmatrix}3\\2\end{pmatrix}$ 的通解为 $k(-2,1)^{T}+(3,-4)^{T}$ . 若 $\beta=(5,-10)^{T}$ , 则 $\beta^{T}A\beta=$ ____.

## 三、解答题

(1) 设 $A$ 是 $m \times n$ 矩阵, $r(A) = n - 2$ , 非齐次线性方程组 $Ax = b$ 的 3 个解向量 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 满足 $\alpha_{1} + \alpha_{2} = (1, 2, 3, 4)^{T}, \alpha_{2} + 2\alpha_{3} = (-2, 1, 5, 3)^{T}, 2\alpha_{3} + 3\alpha_{1} = (11, 5, -6, 7)^{T}$ , 求方程组 $Ax = b$ 的通解.

(2) 设 $A = (\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4})$ 是 4 阶矩阵，非齐次线性方程组 $Ax = \beta$ 的通解为 $(1, 2, 2, 1)^{T} + k(1, -2, 4, 0)$ $^{T}, k$ 为任意常数，记 $B = (\alpha_{3}, \alpha_{2}, \alpha_{1}, \beta - \alpha_{4})$ .

(I) 证明: $r(B)=2;$ 

(II) 求方程组 $Bx = \alpha_{1} - \alpha_{2}$ 的通解.

(3) 设 $A$ 为 $3 \times 4$ 矩阵, $r(A) = 1$ , 若向量组 $\alpha_{1} = (1,2,0,2)^{T}, \alpha_{2} = (-1,-1,1,a)^{T}, \alpha_{3} = (1,-1,a,5)^{T}, \alpha_{4} = (2,a,-3,-5)^{T}$ 与方程组 $Ax = 0$ 的基础解系等价, 求 $Ax = 0$ 的通解.

(4) 设 $A$ 是 3 阶方阵， $A = (a_{ij})_{3 \times 3}$ ，且 $a_{ij} = A_{ij}, i, j = 1, 2, 3$ ，其中 $A_{ij}$ 为 $a_{ij}$ 的代数余子式， $a_{33} \neq 0$ ， $b = (a_{13}, a_{23}, a_{33})^T$ ，求非齐次线性方程组 $Ax = b$ 的解.

(5) 设 $A = \begin{pmatrix} a - 3 & -1 & 2 \\ -1 & a - 3 & 2 \\ -1 & -1 & a \end{pmatrix}$ ，且 $r(E - A) = 1$ .

(I) 求 a 的值;

(II) 若非零列向量 $\alpha, \beta$ 满足 $(A - E)\alpha = \beta, (A^{2} - E)\alpha = 2\beta$ , 求所有满足题意的 $\alpha, \beta$ .

(6) 设 $A = \begin{pmatrix} -1 & 0 & 1 \\ -1 & 1 & a \end{pmatrix}, B = \begin{pmatrix} -1 & 1 \\ -1 & 1 \\ b & 2 \end{pmatrix}$ .

(I) 若方程组 AX=0 的解均是 $B^{T}X=0$ 的解, 但这两个方程组不同解, 求 a,b 的值;

(II) 若方程组 AX=0 与 $B^{T}X=0$ 有非零公共解, 求 a,b 的值, 并求全部非零公共解.

(I) 证明: 方程组 $AX = \alpha$ 的解均是方程组 $BX = \beta$ 的解;

(II) 若方程组 $AX = \alpha$ 与方程组 $BX = \beta$ 不同解, 求 $a$ 的值.

(7) 设 $A = \begin{pmatrix} 2 & 0 & 0 & 2 \\ 1 & 1 & 0 & 3 \\ 0 & 1 & 3 & 5 \end{pmatrix}, B = \begin{pmatrix} 1 & 0 & 1 & 2 \\ 0 & 2 & 0 & 4 \\ 0 & -1 & a - 1 & a - 3 \end{pmatrix}, \alpha = \begin{pmatrix} 2 \\ 2 \\ 1 \end{pmatrix}, \beta = \begin{pmatrix} 1 \\ 2 \\ -1 \end{pmatrix}$ .

(8) 设矩阵 $A = \begin{pmatrix} a & 1 & 1 \\ 0 & a - 1 & 0 \\ 1 & 1 & a \end{pmatrix}$ 不可逆, $\beta = \begin{pmatrix} b \\ 1 \\ 1 \end{pmatrix}$ . 已知方程组 $A^T X = 0$ 的解均是 $\beta^T X = 0$ 的解.

(I) 求 a, b 的值;

(II) 求可逆矩阵 P，使得 $P^{-1}AP = \Lambda$ .

## 拓展题

## 解答题

(1) 设 A 是 $5 \times 4$ 矩阵， $r(A)=2$ ，已知 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 是非齐次线性方程组 Ax=b 的三个解向量，且 $\alpha_{1} + \alpha_{2} = (4,6, -8,4)^{T}, \alpha_{3} = (1,2, -1,1)^{T}$ ，又 $(0,1, -3,0)^{T}$ 是 Ax=0 的解，求 Ax=b 的通解.

(2) 设 A 是 $m \times n$ 矩阵，b 为 m 维列向量，证明: 线性方程组 $A^{T}Ax = A^{T}b$ 必有解.

(3) (I) 设实矩阵 $A_{m \times n}$ 的秩为 $m$ ，证明: 存在实矩阵 $B_{n \times m}$ 且 $r(B) = m$ ，使得 $AB = E$ ，其中 $E$ 为 $m$ 阶单位矩阵.

(II) 若 $A = \begin{pmatrix} -1 & 0 & 1 & -1 \\ 1 & -1 & -1 & -1 \\ 0 & 1 & 0 & 1 \end{pmatrix}$ , 求满足 $AB = E$ 且 $r(B) = 3$ 的所有实矩阵 $B_{4 \times 3}$ .

## 第十四章 相似矩阵

## 基础题

## 一、选择题

(1) 设 $\lambda = 2$ 是矩阵 $A$ 的一个特征值，且 $|A| \neq 0$ ，则 $\left(\frac{1}{3} A^2\right)^{-1}$ 有一个特征值为（）.

A. $\frac{4}{3}$ B. $\frac{3}{4}$ C. $\frac{1}{2}$ D. $\frac{1}{4}$ 

(2) 设 $C = diag(1, 2, 2)$ , $A = \begin{pmatrix} 2 & 0 & 0 \\ 0 & 2 & 1 \\ 0 & 0 & 1 \end{pmatrix}$ , $B = \begin{pmatrix} 2 & 1 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 1 \end{pmatrix}$ ，则（）.
A. A 与 C 相似, B 与 C 不相似
B. A 与 C 相似, B 与 C 相似
C. A 与 C 不相似, B 与 C 相似
D. A 与 C 不相似, B 与 C 不相似

(3)下列矩阵中，不能相似于对角矩阵的是（）.A. $A = \left( \begin{array}{lll}1 & -1 & 3\\ -1 & 2 & 0\\ 3 & 0 & 6 \end{array} \right)$ B. $B = \left( \begin{array}{lll}1 & 0 & 0\\ 0 & 2 & 0\\ 5 & 0 & 3 \end{array} \right)$ C. $C = \left( \begin{array}{lll}0 & 0 & 0\\ 0 & 0 & 0\\ 1 & 2 & 3 \end{array} \right)$ D. $D = \left( \begin{array}{lll}1 & 2 & 0\\ 0 & 0 & 3\\ 0 & 0 & 0 \end{array} \right)$ 

(4) 设矩阵 A 与 B 相似，则必有 ( ).  
A. 矩阵 $\lambda E - A$ 与 $\lambda E - B$ 相等  
B. A, B 同时可逆或不可逆  
C. A 和 B 有相同的特征向量  
D. A 和 B 均与同一个对角矩阵相似

(5) 设 $A$ 为 3 阶方阵, $A$ 的三个特征值为 $1,1,2,\alpha_{1},\alpha_{2},\alpha_{3}$ 分别为对应的三个特征向量, 则 ( ).  
A. $\alpha_{1},\alpha_{2},\alpha_{3}$ 必为 $2E - A$ 的特征向量  
B. $\alpha_{1} + \alpha_{3}$ 必为 $2E - A$ 的特征向量  
C. $\alpha_{1} - \alpha_{2}$ 必为 $2E - A$ 的特征向量  
D. $\alpha_{1},\alpha_{2}$ 必为 $2E - A$ 的特征向量, $\alpha_{3}$ 不是 $2E - A$ 的特征向量

(6) 设 3 阶实矩阵 A 有三重特征值 $1, f(x) = |xE - A| - |A^{-1}|$ ，其中 E 是 3 阶单位矩阵， $x \in R$ ，则至少存在一点 $x_{0} \in (0,1)$ ，使得 $y = f(x)$ 在点 $(x_{0}, f(x_{0}))$ 处的切线（）.
A. 平行于直线 y = 1 B. 垂直于直线 y = 1 C. 平行于直线 y = x D. 垂直于直线 y = x

## 二、填空题

(1) 设方阵 A 满足 $A^{2} + 2A + E = O$ ，则 A 有特征值 ____.

(2) 设 3 阶矩阵 A 的特征值为 0, 1, 2, $B = A^{3} - 2A^{2}$ ，则 $r(B) =$ ____.

(3) 设 3 阶实对称矩阵 A 的特征值为 1,2,-1，特征值 1 与 2 的特征向量分别为 $\alpha_{1}=(2,3,-1)^{T}$ 与 $\alpha_{2}=(1,a,2a)^{T},A^{*}$ 是 A 的伴随矩阵，则方程组 $(A^{*}-2E)X=0$ 的通解是 ____.

(4) 设 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 为线性无关的 3 维列向量， $A = (\alpha_{1}, \alpha_{2}, \alpha_{3})$ ，交换 A 的第 2 列与第 3 列，再将第 2 列乘以 $(-4)$ ，第 3 列乘以 $(-1)$ 得 C，若 BA = C，则 $tr(B) =$ ____ .

## 三、解答题

(1) 设 $A = \begin{pmatrix} 1 & 2 & 2 \\ 2 & 1 & 2 \\ 2 & 2 & 1 \end{pmatrix}$ . 求:

(I)A 的全部特征值和特征向量;

(II) 可逆矩阵 P, 使得 $P^{-1}AP = \Lambda;$ 

(III) 正交矩阵 Q, 使 $Q^{-1}AQ = \Lambda$ .

(2) 判别下列矩阵 A 与 B 是否相似. 若相似, 求可逆矩阵 P, 使得 $P^{-1}AP = B$ .

$$
(I) A = \left( \begin{array}{c c c} 1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1 \end{array} \right), B = \left( \begin{array}{c c c} 3 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{array} \right);
$$

$$
(I I) A = \left( \begin{array}{c c c} 2 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{array} \right), B = \left( \begin{array}{c c c} 1 & 0 & 0 \\ 0 & - 1 & 0 \\ 0 & - 6 & 2 \end{array} \right).
$$

(3) 设矩阵 $A = \begin{pmatrix} 2 & -1 & 2 \\ 5 & a & 3 \\ -1 & b & -2 \end{pmatrix}$ 有特征向量 $\alpha = (1, 1, -1)^T$ .

(I) 试确定参数 a, b 及 $\alpha$ 对应的特征值 $\lambda$ ;

(II) 问 A 能否相似于对角矩阵, 说明理由.

(4) 设 $A = \begin{pmatrix} 1 & -1 & 1 \\ x & 4 & y \\ -3 & -3 & 5 \end{pmatrix}, A \sim \Lambda$ , 且 $\lambda = 2$ 是 $A$ 的二重特征值, 求 $x, y$ 的值及可逆矩阵 $P$ , 使得 $P^{-1}AP = \Lambda$ .

(5) 设 A 是 3 阶矩阵, $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 是线性无关的 3 维列向量, 且 $A\alpha_{1} = \alpha_{1} + \alpha_{2} + \alpha_{3}, A\alpha_{2} = 2\alpha_{2} + \alpha_{3}, A\alpha_{3} = 2\alpha_{2} + 3\alpha_{3}$ . 求:

(I)A 的全部特征值;

(II) 可逆矩阵 P 及 $\Lambda$ , 使得 $P^{-1}AP = \Lambda$ , 并计算 $|A - 2E|$ .

(6) 设 A 是 3 阶实对称矩阵, $A \sim B$ , $B = \begin{pmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 3 & 6 & 9 \end{pmatrix}$ , A 的二重特征值对应的特征向量为 $\alpha_{1} = (1, 1, 0)^{T}$ , $\alpha_{2}=(0,2,1)^{T}$ . 求:

(I)A 的特征值与特征向量;

(II) 可逆矩阵 P, 使得 $P^{-1}AP = \Lambda$ .

(7) 已知 $A \sim B, A = \begin{pmatrix} 1 & a & -1 \\ 1 & 5 & 1 \\ 4 & 12 & 6 \end{pmatrix}, B = \begin{pmatrix} b & b & c \end{pmatrix}$ , 求 $a, b, c$ 的值.

(8) 设 $A = \begin{pmatrix} a & 0 & 1 \\ 0 & -a & 0 \\ 1 & 0 & a \end{pmatrix}$ 与 $B = \begin{pmatrix} -1 & 1 & 0 \\ 1 & -1 & 0 \\ 0 & 0 & a^2 \end{pmatrix} (a \neq 0)$ 相似.

(I) 求 a 的值;

(II) 求正交矩阵 Q, 使得 $Q^{-1}AQ = B;$ 

(III) 求一个 3 阶矩阵 P, 使得 $AB = P^{2}$ .

(9) (I) 设 A 是 n 阶实对称矩阵, 且 $A^{2}=A, r(A)=r(r<n)$ , 计算 $|3E-A|$ ;

(II) 设 $A$ 是 $n$ 阶矩阵, 且 $A^2 = A, r(A) = r (r < n)$ , 计算 $|3E - A|$ .

(10) 设矩阵 $A = \begin{pmatrix} 1 & 1 & 1 \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{pmatrix}$ 有 3 个特征向量 $\alpha_{1} = (1,1,1)^{T}, \alpha_{2} = (1,1,0)^{T}, \alpha_{3} = (1,0,0)^{T}$ .

(I) 求 A;

(II) 求一个可逆矩阵 P, 使得 $P^{-1}AP = A^{T}$ .

## 综合题

## 一、选择题

(1) 设 A, B 是 n 阶可逆矩阵，且 $A^{-1} \sim B^{-1}$ ，则下列结果：
① $AB \sim BA;$ ② $A \sim B;$ ③ $A^{2} \sim B^{2};$ ④ $A^{T} \sim B^{T}$ 

中正确的个数为( ).  
A. 1 B. 2 C. 3 D. 4(2) 设矩阵 $B$ 相似于 $A = \begin{pmatrix} 1 & 1 & 0 & 0 \\ 1 & 1 & 0 & 0 \\ 0 & 0 & 2 & 2 \\ 0 & 0 & 2 & 2 \end{pmatrix}$ , 则 $r_1 = r(B), r_2 = r(B - E), r_3 = r(B - 2E)$ 满足（）.  
A. $r_1 < r_2 < r_3$ B. $r_2 < r_3 < r_1$ C. $r_3 < r_1 < r_2$ D. $r_1 < r_3 < r_2$ 

(3) 与 $\Lambda = \begin{pmatrix} 0 & & \\ & 1 & \\ & & -1 \end{pmatrix}$ 既相似又合同的矩阵是（）.  
A. $A = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & -1 \\ 0 & 2 & -2 \end{pmatrix}$ B. $B = \begin{pmatrix} 1 & 0 & 0 \\ 0 & -1 & -2 \\ 0 & -2 & -4 \end{pmatrix}$ C. $C = \begin{pmatrix} 1 & 0 & 0 \\ 0 & -\frac{1}{2} & \frac{1}{2} \\ 0 & \frac{1}{2} & -\frac{1}{2} \end{pmatrix}$ D. $D = \begin{pmatrix} 1 & 0 & 0 \\ 0 & -1 & 2 \\ 0 & 2 & 2 \end{pmatrix}$ 

(4)下列矩阵中，与矩阵 $\begin{pmatrix} 1 & 1 & 0 \\ 0 & 1 & 1 \\ 0 & 0 & 1 \end{pmatrix}$ 相似的是（）.A. $\begin{pmatrix} 1 & 1 & -1 \\ 0 & 1 & 1 \\ 0 & 0 & 1 \end{pmatrix}$ B. $\begin{pmatrix} 1 & 0 & -1 \\ 0 & 1 & 1 \\ 0 & 0 & 1 \end{pmatrix}$ C. $\begin{pmatrix} 1 & 1 & -1 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}$ D. $\begin{pmatrix} 1 & 0 & -1 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}$ (5) 设 n 阶矩阵 A 有特征值 $\lambda_{1}=1, \lambda_{2}=-1$ ，对应的特征向量为 $\alpha_{1}, \alpha_{2}, k$ 为任意常数，则下列选项中正确的是（）.
A. $k\alpha_{1}$ 必是 A 的特征向量
B. $\alpha_{1}-\alpha_{2}$ 必是 A 的特征向量
C. $\alpha_{1}+\alpha_{2}$ 必是 A 的特征向量
D. $\alpha_{1}+\alpha_{2}$ 必是 $A^{2}$ 的特征向量

(6) 设 A 是 3 阶实对称矩阵, $\alpha = (-1, 1, 1)^{T}$ 满足 $(A - 2E)\alpha = 0$ , 且 $r(A) = 1.k_{1}, k_{2}$ 为任意常数, 则方程组 AX = 0 的通解为 ( ).  
A. $k_{1}(1, 1, 0)^{T} + k_{2}(1, -1, 0)^{T}$ B. $k_{1}(1, 1, 0)^{T} + k_{2}(1, 0, 1)^{T}$ C. $k_{1}(1,1,0)^{T} + k_{2}(1,1,1)^{T}$ D. $k_{1}(1,1,0)^{T} + k_{2}(1,0,-1)^{T}$ 

(7) 设 3 维列向量 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关， $A = (a_{ij})_{3 \times 3}$ 满足 $A\alpha_{1} = \alpha_{1}, A\alpha_{2} = \alpha_{2} + \alpha_{3}, A\alpha_{3} = \alpha_{1} + \alpha_{3}, A_{ij}$ 是 $a_{ij}$ 的代数余子式，则 $A_{11} + A_{22} + A_{33} = (\quad)$ .

A. 1 B. 2 C. 3 D. 4

(8) 设 A, B, C 均为 3 阶矩阵， $r(C) = 1$ ， $r(B) = 2$ ，且满足 $(A + E)C = O, B(A^T - 2E) = O$ ，则下列矩阵中与 A 相似的是（）.

A. $\begin{pmatrix} 2 & 1 & 0 \\ 0 & 2 & 1 \\ 0 & 0 & 1 \end{pmatrix}$ B. $\begin{pmatrix} -1 & 1 & 0 \\ 0 & -1 & 1 \\ 0 & 0 & 2 \end{pmatrix}$ C. $\begin{pmatrix} -2 & 0 & 0 \\ 0 & -2 & 0 \\ 0 & 0 & 1 \end{pmatrix}$ D. $\begin{pmatrix} -1 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 2 \end{pmatrix}$ 

(9) 设两个不相等的 3 阶矩阵 A, B 满足 $(A - B)^{2} = O$ ，则下列选项中正确的是（）.
A. A - B 是对角矩阵
B. A - B 只有一个线性无关的特征向量
C. A - B 有两个线性无关的特征向量
D. A - B 有三个线性无关的特征向量

(10) 设 A 为 2 阶实矩阵, $\alpha$ 与 $\beta$ 是 A 的两个单位实特征向量, 且满足 $\left|\left|\alpha + \beta\right|\right| = \left|\left|\alpha - \beta\right|\right|$ , 则 ( ).  
A. $r(A) = 1$ B. $r(A) = 2$ C. A 必相似于对角矩阵
D. A 必与单位矩阵合同

## 二、填空题

(1) 设 A 是 3 阶方阵, $\alpha$ 为 3 维列向量, $P = (\alpha, A\alpha, A^{2}\alpha)$ 为可逆矩阵, $B = P^{-1}AP$ , 且 $A^{3}\alpha + 2A^{2}\alpha = 3A\alpha$ , 则 $|A + E| =$ ____ .

(2) 设 $A_{3 \times 3}$ 是秩为 1 的实对称矩阵, $\lambda_1 = 2$ 是 $A$ 的一个特征值, 对应的特征向量为 $\alpha_1 = (-1, 1, 1)^T$ , 则方程组 $Ax = 0$ 的基础解系为 ____.

(3) 设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{k} (k > 1)$ 是 n 维正交单位实列向量组, $A = \sum_{i=1}^{k} \alpha_{i} \alpha_{i}^{T}, E$ 是 n 阶单位矩阵, 则行列式 $\left| (A + E)^{*} \right| =$ ____.

## 三、解答题

(1) 已知 $A = (\alpha_{1}, \alpha_{2}, \alpha_{3})$ 是 3 阶可逆矩阵, $B$ 是 3 阶矩阵, 且 $BA = (\alpha_{1}, -4\alpha_{3}, -\alpha_{2})$ . 求:

(I)B 的全部特征值;

(II) 可逆矩阵 P 和对角矩阵 $\Lambda$ ，使得 $P^{-1}BP = \Lambda$ .

(2) 设 A 是 $n(n \geqslant 2)$ 阶矩阵， $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是 n 维列向量，且 $A\alpha_{1} = \alpha_{2}, A\alpha_{2} = \alpha_{3}, \cdots, A\alpha_{n-1} = \alpha_{n}, A\alpha_{n} = 0, \alpha_{n} \neq 0.$ 

(II) 求可逆矩阵 P 及三角矩阵 B, 使得 $P^{-1}AP = B$ .

(I) 证明: $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 线性无关;

(3) 设 A 是 3 阶矩阵， $\alpha_{1},\alpha_{2}$ ， $\alpha_{3}$ 是 3 维列向量，且 $\alpha_{1}\neq0$ ， $A\alpha_{1}=k\alpha_{1}$ ， $A\alpha_{2}=\alpha_{1}+k\alpha_{2}$ ， $A\alpha_{3}=\alpha_{2}+k\alpha_{3}$ .

(I) 证明: $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 是 $R^{3}$ 的一组基;

(II) 若 $A\alpha_{1}, A\alpha_{2}, A\alpha_{3}$ 线性相关，求 $r(A)$ 及 $tr(A)$ .

(I) 证明: $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关;

(4) 设 $\alpha_{1}$ 是 3 阶矩阵 A 的属于特征值 $\lambda(\lambda \neq 0)$ 的特征向量, 3 维列向量 $\alpha_{2}, \alpha_{3}$ 满足 $(\lambda E - A)\alpha_{2} = \alpha_{1}, (\lambda E - A)\alpha_{3} = \alpha_{2}.$ 

(II) 计算行列式 $\left|A+A^{*}\right|$ ，其中 $A^{*}$ 是 A 的伴随矩阵.

(5) 设 $A_{3 \times 3}$ 有三个不同的特征值 $\lambda_1, \lambda_2, \lambda_3$ , 它们对应的特征向量分别为 $\alpha_1, \alpha_2, \alpha_3$ , 令 $\beta = \alpha_1 + \alpha_2 + \alpha_3$ .

(I) 证明: $\beta, A\beta, A^2\beta$ 线性无关;

(II) 若 $A^{3}\beta = A\beta$ , 求 $r(A - E)$ .

(6) 设 $\alpha=(a_{1},a_{2},\cdots,a_{n})^{T},\beta=(b_{1},b_{2},\cdots,b_{n})^{T}$ 均为非零列向量, $A=\alpha\beta^{T}$ .

(I) 求 A 的全部特征值;

(II) 问 $\alpha^T\beta$ 满足什么条件时, $A$ 可以相似于对角矩阵 $\Lambda$ , 并求可逆矩阵 $P$ , 使 $P^{-1}AP = \Lambda$ .

(7) 设 $n(n>2)$ 阶矩阵 $A=\begin{pmatrix}a&1&1&\cdots&1\\1&a&1&\cdots&1\\1&1&a&\cdots&1\\\vdots&\vdots&\vdots&&\vdots\\1&1&1&\cdots&a\end{pmatrix}$ . 求:

(I) 可逆矩阵 P 及对角矩阵 $\Lambda$ , 使得 $P^{-1}AP = \Lambda$ ; $(II)r(A^{*})$ .

(8) 设 A 是 2 阶矩阵, $\alpha$ 是非零向量, 且 $\alpha$ 不是 A 的特征向量.

(I) 证明: $\alpha, A\alpha$ 线性无关;

(II) 记 $P = (\alpha, A\alpha)$ ，若 $A^{2}\alpha - 2A\alpha = 8\alpha$ ，证明：A 相似于对角矩阵，并求 $P^{-1}AP$ .

(9) 设 $\alpha, \beta$ 为 3 维单位列向量, 且 $\alpha^{T}\beta = 0$ , 记 $A = \alpha\beta^{T} + \beta\alpha^{T}$ .

(I) 证明: A 相似于对角矩阵;

(II) 若存在 3 维列向量 $\gamma \neq 0$ ，使得 $A\gamma = 0$ ，记 $P = (\gamma, 2(\alpha + \beta), \beta - \alpha)$ ，求 $P^{-1}AP$ .

(10) 设 $A = \begin{pmatrix} 1 & a_{12} & a_{13} \\ 1 & a_{22} & a_{23} \\ 1 & a_{32} & a_{33} \end{pmatrix}$ 可逆, B 是 3 阶实对称矩阵, 且满足 $BA = \begin{pmatrix} 1 & 2a_{12} & 2a_{13} \\ 1 & 2a_{22} & 2a_{23} \\ 1 & 2a_{32} & 2a_{33} \end{pmatrix}$ . 求:

(I)B 的特征值和对应的特征向量;

(II) 正交矩阵 Q，使得 $Q^{T}BQ = \Lambda$ .

(11) 设向量组 $(I)\alpha_{1} = (-a,0,1)^{T},\alpha_{2} = (1 - a,a,1 - a)^{T},\alpha_{3} = (1,0, - a)^{T},(II)\beta_{1} = (-1,0,a)^{T},$ 

$\beta_{2}=(-1,1,a)^{T},\beta_{3}=(1,-1,-a)^{T}(a\neq0)$ , 向量组 $(I)$ 与 $(II)$ 等价.

(I) 求 a 的值;

(II) 记 $A = (\alpha_{1}, \alpha_{2}, \alpha_{3})$ , 问当 $a$ 为何值时, 存在正交矩阵 $Q$ , 使得 $Q^{-1}AQ = \Lambda$ ? 并求 $Q$ 及 $\Lambda$ .

(12) 设 $A = \begin{pmatrix} a & 0 & 1 \\ 0 & -a & 0 \\ 1 & 0 & a \end{pmatrix}, B = \begin{pmatrix} -1 & 1 & 0 \\ 1 & -1 & 0 \\ 0 & 0 & -a \end{pmatrix}, \beta = \begin{pmatrix} 1 \\ 1 \\ a \end{pmatrix}, a \neq 0$ . 若方程组 $AX = \beta$ 有无穷多解.

(I) 求 a 的值, 并求方程组 $AX = \beta$ 的全部解;

(II) 当 $a$ 为何值时, 存在正交矩阵 $Q$ , 使得 $Q^{-1}AQ = B$ ? 并求正交矩阵 $Q$ .

(13) 设 A, B 均是 n 阶矩阵.

(I) 证明: AB 与 BA 有相同的特征值;

(II) 若 AB = BA，且 A 有 n 个不同的特征值，证明: B 相似于对角矩阵.

(14) 设 $A = \begin{pmatrix} 0 & 2 & 3 \\ 2 & 2 & a \\ 2 & 3 & 4 \end{pmatrix}$ , 3 阶实对称矩阵 $B$ 满足 $AB + B = A + E, B \neq E$ , 其中 $E$ 为单位矩阵.

(I) 求 a 的值;

(Ⅱ) 求所有满足题干的矩阵 B;

(III) 求可逆矩阵 P 及对角矩阵 $\Lambda$ , 使得 $P^{-1}BP = \Lambda$ .

(15) 设向量 $\beta = (b, 1, 1)^T$ 可由 $\alpha_1 = (a, 0, 1)^T$ , $\alpha_2 = (1, a - 1, 1)^T$ , $\alpha_3 = (1, 0, a)^T$ 线性表示, 且表示法不唯一. 记 $A = (\alpha_1, \alpha_2, \alpha_3)$ . 求:

(I)a,b 的值, 并写出 $\beta$ 由 $\alpha_{1},\alpha_{2},\alpha_{3}$ 表示的线性表达式;

(II)一个可逆矩阵 P, 使得 $P^{-1}AP = \Lambda (\Lambda \text{ 为对角矩阵})$ .

(16) 设 $A = \begin{pmatrix} 2 & 1 & 0 \\ 1 & 2 & 0 \\ 0 & 0 & 1 \end{pmatrix}$ 与 $B = \begin{pmatrix} a & b & c \\ 0 & 1 & 0 \\ -1 & -2 & 4 \end{pmatrix}$ 相似.

(I) 求 a, b, c 的值;

(II) 求可逆矩阵 P, 使得 $P^{-1}AP = B$ ;

(III) 记 A 的伴随矩阵为 $A^{*}$ ，求方程组 $(3E-A^{*})X=0$ 的通解.

(17) 设 $B = \begin{pmatrix} 1 & -1 & 0 \\ 1 & 0 & k \\ -1 & 1 & 1 - k \end{pmatrix}$ 不可逆, 且满足 $AB = B, B^{*}(A^{T} + E) = O$ , 其中 $A$ 是3阶矩阵, $E$ 是3阶单位矩阵, $B^{*}$ 是 $B$ 的伴随矩阵.

(I) 求 $r(B^{*})$ ;

(II) 证明: A 相似于对角矩阵, 并求 $A^{2}$ .

## 拓展题

## 解答题

(1) 设 $A$ 是 3 阶实对称矩阵，存在可逆矩阵 $P$ ，使得 $P^{-1}AP = \text{diag}(1,2,-1)$ ，且 $\alpha_{1} = (1,k+1,2)^{T}$ ， $\alpha_{2} = (k-1,-k,1)^{T}$ 分别为 $A$ 的特征值 $\lambda_{1} = 1, \lambda_{2} = 2$ 对应的特征向量， $A^{*}$ 的特征值 $\lambda_{0}$ 对应的特征向量 $\beta = (2,-5k,2k+1)^{T}$ . 求：

$(I)\lambda_{0}$ 与 k 的值;

(II) 矩阵 $(A^{-1})^{*}$ .

(2) 设数列 $\{a_{n}\}$ ， $\{b_{n}\}$ 满足 $\begin{pmatrix} a_{n} \\ b_{n} \end{pmatrix} = \begin{pmatrix} 1 & 2 \\ -1 & 4 \end{pmatrix} \begin{pmatrix} a_{n-1} \\ b_{n-1} \end{pmatrix} (n=1,2,\cdots), a_{0}=1, b_{0}=-1$ ，求级数 $\sum_{n=0}^{\infty} \frac{1}{a_{n}-b_{n}}$ 的和.

## 第十五章 二次型

## 基础题

## 一、选择题

(1)二次型 $f(x_{1},x_{2},x_{3}) = (x_{1} - x_{2})^{2} + (x_{2} - x_{3})^{2} + (x_{3} - x_{1})^{2}$ 的标准形为（ ）.A. $f = y_1^2 +y_2^2 +y_3^2$ B. $f = 2y_{1}^{2} + \frac{3}{2} y_{2}^{2}$ C. $f = y_1^2 +y_2^2 -y_3^2$ D. $f = 2y_{1}^{2} + \frac{3}{2} y_{2}^{2} + y_{3}^{2}$ 

$$
\left( \begin{array}{c c c} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{array} \right)
$$

(2) 设 $A = \begin{pmatrix} 1 & 2 & 3 \end{pmatrix}$ 与 $B = \begin{pmatrix} 2 & 3 & 1 \end{pmatrix}$ 合同，则合同变换矩阵 $P = (\quad)$ .

$$
\left( \begin{array}{c c c} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{array} \right)
$$

$$
\left( \begin{array}{c c c} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{array} \right)
$$

$$
\left( \begin{array}{c c c} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{array} \right)
$$

(3) 设 A 是 n 阶方阵，将 A 的第 i 列与第 j 列互换，再交换第 i 行与第 j 行得到 B，则（）
A. A 与 B 等价、相似且合同
B. A 与 B 相似、合同但不等价
C. A 与 B 相似但不合同
D. A 与 B 等价但不相似

(4)二次型 $f(x_{1},x_{2},x_{3}) = x_{1}^{2} + 4x_{2}^{2} + 4x_{3}^{2} - 4x_{1}x_{2} + 4x_{1}x_{3} - 8x_{2}x_{3}$ 的规范形为（）.A. $f = z_1^2$ B. $f = z_1^2 -z_2^2$ C. $f = z_1^2 +z_2^2 +z_3^2$ D. $f = z_1^2 +z_2^2 -z_3^2$ 

(5) 设 E 是 n 阶单位矩阵, 则 $n(n$ 为偶数 $)$ 阶实对称矩阵 A 正定的充分必要条件是 ( ).  
A. 存在 n 阶矩阵 C, 使得 $A = C^{T}C$ B. 二次型 $X^{T}AX$ 的负惯性指数为 0  
C. 存在可逆矩阵 P, 使得 $P^{-1}AP = E$ D. A 的伴随矩阵 $A^{*}$ 与 E 合同

(6) 设 $A = \begin{pmatrix} 1 & 2 & 0 \\ 2 & 0 & 2 \\ 0 & 2 & -1 \end{pmatrix}$ ，若存在可逆矩阵 C，使得 $C^{T}AC = \Lambda$ ，则 C 可能为（）.
A. $\begin{pmatrix}1&-1&-1\\0&\frac{1}{2}&\frac{1}{2}\\0&0&1\end{pmatrix}$ B. $\begin{pmatrix}1&2&0\\0&2&-1\\0&0&1\end{pmatrix}$ C. $\begin{pmatrix}1&2&0\\0&1&2\\0&0&1\end{pmatrix}$ D. $\begin{pmatrix}1&1&1\\0&\frac{1}{2}&\frac{1}{2}\\0&0&1\end{pmatrix}$ (7) 设 $A = \begin{pmatrix} 1 & 1 & 0 \\ 1 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}$ ，则下列矩阵中与 A 既不相似也不合同的是（）.
A. $\begin{pmatrix}3&0&0\\0&2&0\\0&0&0\end{pmatrix}$ B. $\begin{pmatrix}1&2&1\\2&5&2\\1&2&1\end{pmatrix}$ C. $\begin{pmatrix}1&-1&0\\-1&1&0\\0&0&1\end{pmatrix}$ D. $\begin{pmatrix}1&0&0\\0&1&0\\0&0&-1\end{pmatrix}$ 

(8) 设 A 是实对称矩阵， $B = \left( b_{ij} \right)_{3 \times 3}$ 是可逆矩阵，且 $AB = \begin{pmatrix} b_{11} & 2b_{12} & -b_{13} \\ b_{21} & 2b_{22} & -b_{23} \\ b_{31} & 2b_{32} & -b_{33} \end{pmatrix}$ ，则二次型 $X^TAX$ 的规范形为（）.

A. $y_1^2 + y_2^2 + y_3^2$ B. $y_1^2 + y_2^2 - y_3^2$ C. $y_1^2 - y_2^2 - y_3^2$ D. $-y_1^2 - y_2^2 - y_3^2$ 

(9) 设二次型 $f(x_{1}, x_{2}, x_{3}) = x_{1}^{2} + x_{2}^{2} + x_{3}^{2} - 4x_{1}x_{2} - 4x_{1}x_{3} - 4x_{2}x_{3}$ ，则 $f(x_{1}, x_{2}, x_{3}) = 1$ 在空间直角坐标系下表示的二次曲面为（）.  
A. 椭球面 B. 柱面 C. 单叶双曲面 D. 双叶双曲面

(10)若二次曲面 $x^{2} + (k + 2)y^{2} + kz^{2} + 2xy = 5$ 表示一个椭球面，则（）A. $k > 0$ B. $k <   0$ C. $k > - 1$ D. $k <   - 1$ 

## 二、填空题

(1) 已知二次型 $f(x_{1}, x_{2}, x_{3}) = x_{1}^{2} + 4x_{2}^{2} + 4x_{3}^{2} + 2ax_{1}x_{2} - 2x_{1}x_{3} + 4x_{2}x_{3}$ 正定，则 a 的取值范围为 ____

(2) 设二次型 $f(x_{1}, x_{2}, x_{3}) = X^{T}AX(A^{T} = A)$ 在正交变换下的标准形为 $-2y_{1}^{2} + 8y_{2}^{2}$ ，且 $E + B = AB$ ，其中 B 为 3 阶矩阵，则迹 $tr(B^{-1} + 2E) =$ ____.

## 三、解答题

(1) 设二次型 $f(x_{1}, x_{2}, x_{3}) = 2x_{1}^{2} + 5x_{2}^{2} + 5x_{3}^{2} + 4x_{1}x_{2} - 4x_{1}x_{3} - 8x_{2}x_{3}.$ 

(I) 求一个正交变换 x = Qy，将 f 化为标准形；

(II) 利用配方法, 将 f 化为标准形.

(2) 已知二次型 $f = 2x_{1}^{2} + 3x_{2}^{2} + 3x_{3}^{2} + 2ax_{2}x_{3} (a > 0)$ ，经过正交变换化成标准形 $y_{1}^{2} + 2y_{2}^{2} + 5y_{3}^{2}$ ，求参数 $a$ 及所用的正交变换.

(3) 设 $A = \begin{pmatrix} 2 & 0 & 1 \\ 0 & 2 & -1 \\ 1 & -1 & a - 1 \end{pmatrix}$ 与 $B = \begin{pmatrix} 0 & 0 & 0 \\ 0 & b & 0 \\ 0 & 0 & 3 \end{pmatrix}$ 合同.

(I) 求 a 的值及 b 的取值范围;

(II) 若存在正交矩阵 $Q$ , 使得 $Q^T AQ = B$ , 求 $b$ 及 $Q$ .

(4) 设二次型 $f(x_{1}, x_{2}, x_{3}) = (x_{1} + x_{2})^{2} + (x_{2} - x_{3})^{2} + (x_{1} + ax_{3})^{2}$ .

(I) 求 $f(x_{1}, x_{2}, x_{3}) = 0$ 的解;

(II) 当 $f(x_{1}, x_{2}, x_{3}) = 0$ 有非零解时, 求正交变换 X = QY 将 $f(x_{1}, x_{2}, x_{3})$ 化为标准形;

(III) 求 $f(x_{1}, x_{2}, x_{3})$ 的规范形.

(5) 设 3 阶实对称矩阵 $A = (\alpha_{1}, \alpha_{2}, \alpha_{3})$ 有二重特征值 1, 且 $\alpha_{1} + 2\alpha_{2} - \alpha_{3} = 0, A^{*}$ 是 $A$ 的伴随矩阵.

(I) 求正交变换 X = QY 将二次型 $f(x_{1}, x_{2}, x_{3}) = X^{T}AX$ 化为标准形;

(II) 求方程组 $A^{*}X=0$ 的通解.

(6) 设实对称矩阵 $A = \left(a_{ij}\right)_{3 \times 3}$ 有二重特征值1, 且 $\sum_{i=1}^{3} a_{ij} = 0 (j = 1, 2, 3)$ .

(I) 记 $X = (x_{1}, x_{2}, x_{3})^{T}$ , 求方程 $X^{T}AX = 0$ 的全部解;

(II) 求可逆矩阵 P, 使得 $X^{T}(2E-A)X=||PX||^{2}$ .

## 综合题

## 一、选择题

(1)二次型 $f(x_{1},x_{2},x_{3}) = x_{1}x_{2} + x_{2}x_{3}$ 的正、负惯性指数分别为（ ）.A. $p = 1,q = 1$ B. $p = 1,q = 2$ C. $p = 1,q = 0$ D. $p = 0,q = 2$ 

(2) 方程 $(x-y)^{2}+(y-z)^{2}+(z-x)^{2}=1$ 表示的曲面是（）.
A. 椭球面 B. 单叶双曲面 C. 双叶双曲面 D. 柱面

(3) 设 $A=\begin{pmatrix}2&1\\-1&0\end{pmatrix},B=\begin{pmatrix}1&1\\0&1\end{pmatrix},C=\begin{pmatrix}1&0\\1&1\end{pmatrix},D=\begin{pmatrix}1&0\\0&1\end{pmatrix}$ ，则下列选项中正确的是（）.
A. A 与 B 相似，B 与 C 合同
B. A 与 D 相似，B 与 D 合同
C. A 与 D 合同，B 与 C 相似
D. B 与 D 相似，C 与 D 合同

(4) 设 A 是 3 阶实对称矩阵, 且 $|A| = 2, A^{*} = A - E$ , 其中 $A^{*}$ 是 A 的伴随矩阵, 则二次型 $x^{T}Ax$ 的规范形为 ( ).  
A. $y_{1}^{2} + y_{2}^{2} + y_{3}^{2}$ B. $-y_{1}^{2} - y_{2}^{2} - y_{3}^{2}$ C. $y_{1}^{2} + y_{2}^{2} - y_{3}^{2}$ D. $-y_{1}^{2} - y_{2}^{2} + y_{3}^{2}$ 

(5) 设 $A=\begin{pmatrix}1 & 2 \\ 2 & 1\end{pmatrix}, B=\begin{pmatrix}1 & 4 \\ 1 & 1\end{pmatrix}$ ，则下列选项中正确的是（）.
A. 必存在正交矩阵 Q，使得 $Q^{-1}AQ = B$ B. 必存在可逆矩阵 P，使得 $P^{-1}AP = B$ C. 必存在可逆矩阵 P, 使得 $P^{T}AP = B$ D. 必存在可逆矩阵 P, 使得 $A' = P^{T}P$ 

(6) 设实矩阵 $A = \begin{pmatrix} a & a - 1 \\ a - 1 & a - 1 \end{pmatrix}$ , 若对任意的2维非零实列向量 $X$ , 都有 $|X^T A X| < |X^T X|$ , 则 $a$ 的取值范围为 ( ).  
A. $\left(\frac{1}{3}, 1\right)$ B. $(-1, 1)$ C. $(-1, 0]$ D. $\left(\frac{1}{3}, 1\right]$ 

(7) 设 $\alpha_{1}=(1,2)^{T},\alpha_{2}=(a,1)^{T},X=(x_{1},x_{2})^{T}$ ，若二次型 $f(x_{1},x_{2})=(\alpha_{1},X)^{2}+(\alpha_{2},X)^{2}$ 经可逆线性变换 X=PY 化为 $g(y_{1},y_{2})=by_{1}^{2}+by_{2}^{2}+2by_{1}y_{2}(b\neq0)$ ，则（）.
A. $a=\frac{1}{2},b>0$ B. $a=-\frac{1}{2},b>0$ C. $a=\frac{1}{2},b>-1$ D. $a=-\frac{1}{2},b>-1$ 

(8) 设 A 是 2 阶实对称矩阵，若对任意的 2 维非零列向量 X，都有 $\left|X^{T}AX\right| < \left|X^{T}X\right|$ ， $X_{1}, X_{2}$ 均为 2 维列向量，则二次型 $\binom{X_{1}}{X_{2}}^{T}\binom{A+E}{O}\binom{O}{E-A}\binom{X_{1}}{X_{2}}$ 的规范形为（）.
A. $y_{1}^{2} + y_{2}^{2} - y_{3}^{2} - y_{4}^{2}$ B. $y_{1}^{2} + y_{2}^{2} + y_{3}^{2} - y_{4}^{2}$ C. $y_{1}^{2} + y_{2}^{2} + y_{3}^{2} + y_{4}^{2}$ D. $-y_{1}^{2}-y_{2}^{2}-y_{3}^{2}-y_{4}^{2}$ 

(9) 设 A 是 3 阶实矩阵, $|A| = 3$ , 且 $A^{*} = -A + 4E$ , 其中 $A^{*}$ 是 A 的伴随矩阵, E 是 3 阶单位矩阵, 则二次型 $X^{T}(2E - A)^{T}(2E - A)X$ 的规范形为 ( ).  
A. $y_{1}^{2} - y_{2}^{2} - y_{3}^{2}$ B. $y_{1}^{2} + y_{2}^{2} - y_{3}^{2}$ C. $y_{1}^{2} + y_{2}^{2} + y_{3}^{2}$ D. $-y_{1}^{2} - y_{2}^{2} - y_{3}^{2}$ 

(10) 设 $A = \begin{pmatrix} -1 & 1 \\ 1 & 1 \end{pmatrix}$ , 非零实列向量 $\alpha = (a, b)^T$ , 则二次型 $f(x_1, x_2, x_3) = X^T \begin{pmatrix} A + \alpha \alpha^T & \alpha \\ \alpha^T & 1 \end{pmatrix} X$ 的规范形为（）.  
A. $y_1^2 + y_2^2 + y_3^2$ B. $-y_1^2 - y_2^2 - y_3^2$ C. $y_1^2 + y_2^2 - y_3^2$ D. $y_1^2 - y_2^2 - y_3^2$ 

(11) 设 A 是 3 阶实对称矩阵, $B = (\alpha_{1}, \alpha_{2}, \alpha_{3})$ 是 3 阶可逆矩阵, 且 $AB = (\alpha_{1}, \alpha_{2} - 2\alpha_{3}, \alpha_{3} - 2\alpha_{2})$ , 记 $X = (x_{1}, x_{2}, x_{3})^{T}$ , 则二次型 $f(x_{1}, x_{2}, x_{3}) = tr(AXX^{T})$ 的规范形为 ( ).  
A. $y_{1}^{2} - y_{2}^{2} - y_{3}^{2}$ B. $y_{1}^{2} + y_{2}^{2} - y_{3}^{2}$ C. $y_{1}^{2} + y_{2}^{2} + y_{3}^{2}$ D. $-y_{1}^{2} - y_{2}^{2} - y_{3}^{2}$ 

(12) 已知 $A=\begin{pmatrix}1-a & a \\ a & a\end{pmatrix}, X=(x_{1},x_{2})^{T}$ ，二次型 $f(x_{1},x_{2})=\begin{vmatrix}A & X \\ -X^{T} & 0\end{vmatrix}$ ，则 A 正定是 $f(x_{1},x_{2})$ 正定的（）
A. 充分不必要条件
B. 必要不充分条件
C. 充分必要条件
D. 既不充分也不必要条件

## 二、填空题

(1) 设 A 是 n 阶矩阵，方程组 Ax = b 有唯一解，则二次型 $x^{T}(A^{T}A)x$ 的正惯性指数为 ____.

(2) 设 A 是 3 阶实对称矩阵，二次型 $x^{T}Ax$ 经过正交变换 x = Qy 后的标准形为 $y_{1}^{2} + y_{2}^{2} - y_{3}^{2}, A^{*}$ 是 A 的伴随矩阵，则二次型 $x^{T}A^{*}x$ 的规范形为 ____.

(3) 设 3 阶实对称矩阵 A 的特征值为 2, 3, 4, $A^{*}$ 是 A 的伴随矩阵. 若对任意 3 维实列向量 X，都有 $\left|X^{T}A^{*}X - X^{T}AX\right| \leqslant aX^{T}X$ ，则 a 的最小取值为 ____.

## 三、解答题

(1) 设二次型 $f(x_{1}, x_{2}, x_{3}) = x^{T}Ax = x_{1}^{2} + ax_{2}^{2} + x_{3}^{2} + 2x_{1}x_{2} - 2ax_{1}x_{3} - 2x_{2}x_{3}$ 的正负惯性指数都是 1. 求: (I)a 的值;

(II) 可逆线性变换 $x = By$ , 将 $f(x_{1}, x_{2}, x_{3})$ 化为标准形.

(2) 设 3 阶实对称矩阵 $A = (a_{ij})_{3 \times 3}$ 有特征值 $\lambda_1 = \lambda_2 = 2$ ，且 $\sum_{i=1}^{3} a_{ii} = 1, \alpha = (1,0,-2)^T$ 是方程组 $A^* x = 4\alpha$ 的解向量. 求:

(I) 矩阵 A;

(II) 正交变换 $x = Qy$ , 将二次型 $f(x_{1}, x_{2}, x_{3}) = x^{T}Ax$ 化为标准形.

(3) 设 n 阶实对称矩阵 A 只有两个不同的特征值 $\lambda_{1}=1$ 和 $\lambda_{2}$ ，且 A 属于 $\lambda_{1}=1$ 的特征向量仅有 $k(1,0,\cdots,0,1)^{T}(k\neq0)$ .

(I) 求矩阵 A;

(II) 当 $\lambda_{2}$ 满足什么条件时, A 是正定矩阵.

(4) 设二次型 $f(x_1, x_2, x_3) = ax_1^2 - ax_2^2 + ax_3^2 + 2x_1x_3$ 与 $g(y_1, y_2, y_3) = -y_1^2 - y_2^2 + a^2y_3^2 + 2y_1y_2$ 的秩相等 $(a \neq 0)$ . 问:

(I) 当 a 为何值时, 仅存在可逆 (非正交) 线性变换 x = Py, 可将 $f(x_{1}, x_{2}, x_{3})$ 化为 $g(y_{1}, y_{2}, y_{3})$ , 并求一个可逆矩阵 P;

(II) 当 $a$ 为何值时, 存在正交变换 $x = Qy$ , 将 $f(x_{1}, x_{2}, x_{3})$ 化为 $g(y_{1}, y_{2}, y_{3})$ , 说明理由.

(5) 设二次型 $f(x_1, x_2, x_3) = x^T Ax = ax_1^2 + ax_2^2 + (a - 1)x_3^2 + 2x_1x_3 - 2x_2x_3$ （ $a$ 为常数， $A^T = A$ ）.

(I) 求一个正交变换 $x = Qy$ 将 $f(x_{1}, x_{2}, x_{3})$ 化为标准形;

(II) 设 $x = (x_{1}, x_{2}, x_{3})^{T}$ , 求方程 $x^{T}(aE - A)^{2}x = 0$ 的全部解.

(6) 设二次型 $x^{T}Ax = a(x_{1}^{2} + x_{2}^{2} + x_{3}^{2}) + 2x_{1}x_{2} + 2bx_{1}x_{3} + 2x_{2}x_{3}$ , 在正交变换 $x = Qy$ 下的标准形为 $y_{1}^{2} + y_{2}^{2} + 4y_{3}^{2}$ , 其中 $A^{T} = A$ .

(I) 求 a, b 的值及正交矩阵 Q;

(II) 若正定矩阵 B 满足 $B^{2}=A+A^{*}$ ，其中 $A^{*}$ 是 A 的伴随矩阵，求 B.

(7) 设 $A$ 是 3 阶矩阵, 方程组 $AX = b$ 的通解为 $k_{1}(-1,1,0)^{T} + k_{2}(2,0,1)^{T} + (1,1,-2)^{T}$ . 其中 $b = (6,6,-12)^{T}, k_{1}, k_{2}$ 为任意常数.

(I) 求 A;

(II) 若 A 的列向量组的极大线性无关组为 $\alpha$ ，求一个 3 维行向量 $\beta$ ，使得 $A^{2} = \alpha \beta$ ;

(III) 记 $X = (x_{1}, x_{2}, x_{3})^{T}$ , 求方程 $X^{T}AX = 0$ 的全部解.

(8) 设二次型 $f(x_1, x_2, x_3) = X^T A X (A^T = A)$ 经过正交变换 $X = Q Y$ 化为标准形 $2y_1^2 - y_2^2 - y_3^2$ ，又 $A^* \alpha = \alpha$ ，其中 $\alpha = (1, 1, -1)^T, A^*$ 是 $A$ 的伴随矩阵.

(I) 求正交矩阵 Q 及实对称矩阵 A;

(II) 若正定矩阵 $B$ 满足 $B^{2} = A + 2E$ , 求 $B$ .

(9) 已知二次型 $f(x_{1}, x_{2}, x_{3}) = x_{1}^{2} + 2x_{2}^{2} + ax_{3}^{2} + 2x_{1}x_{3}$ 经过可逆线性变换 X = PY 化为 $y_{1}^{2} + y_{3}^{2}$ .

(I) 求 a 的值及可逆矩阵 P;

(II) 设 $X = (x_{1}, x_{2}, x_{3})^{T}$ ，当 $X^{T}X = 1$ 时，求 $f(x_{1}, x_{2}, x_{3})$ 的最大值，并求满足 $x_{1} = x_{2} > 0$ 的最大值点.

(10) 设 $A = \begin{pmatrix} a & 0 \\ -1 & a \\ -1 & 0 \end{pmatrix}, B = \begin{pmatrix} -1 & 0 & a \\ -1 & 1 & a \end{pmatrix}$ , 已知方程组 $ABX = 0$ 与 $BX = 0$ 同解.

(I) 求 a 的取值范围;

(II) 当 AB 为实对称矩阵时, 求正交变换 X = QY, 将二次型 $f(x_{1}, x_{2}, x_{3}) = X^{T}ABX$ 化为标准形.

(11) 设 $A = \begin{pmatrix} 1 & -1 & 0 \\ -1 & 1 + a^2 & a \\ 0 & a & 1 \end{pmatrix} (a \neq 0), X = (x_1, x_2, x_3)^T$ .

(I) 若对 $\forall X \neq 0$ , 有 $X^T(A - kE)X \leqslant 0$ , 求 $k$ 的最小值;

(II) 求可逆线性变换 X = CY，将二次型 $f(x_{1}, x_{2}, x_{3}) = X^{T}AX$ 化为

$$
g \left(y _ {1}, y _ {2}, y _ {3}\right) = y _ {1} ^ {2} + y _ {2} ^ {2} + y _ {3} ^ {2} - 2 y _ {1} y _ {2}.
$$

(12) 设二次型 $f(x_{1}, x_{2}, x_{3}) = 2(x_{1}^{2} + x_{2}^{2} + x_{3}^{2}) + 2a(x_{1}x_{2} + x_{1}x_{3} + x_{2}x_{3}), a$ 为正整数.

(I) 求正交变换 X = QY，将 $f(x_{1}, x_{2}, x_{3})$ 化为标准形；

(II) 若存在可逆矩阵 $P$ , 对任意 $X = (x_{1}, x_{2}, x_{3})^{T}$ , 有 $f(x_{1}, x_{2}, x_{3}) = ||PX||^{2}$ . 求 $a$ 的值及 $P$ .

## 拓展题

## 一、选择题

设3阶实矩阵 $A$ 的特征向量为 $\alpha_{1} = (-1,1,0)^{T},\alpha_{2} = (1,1,1)^{T},\alpha_{3} = (-1, - 1,2)^{T}$ ，则 $A$ 必为（）.A.可逆矩阵 B.正交矩阵 C.对称矩阵 D.正定矩阵

## 二、解答题

(1) 设二次型 $f(x_{1}, x_{2}, \cdots, x_{n}) = nx_{1}^{2} + nx_{2}^{2} + \cdots + nx_{n}^{2} - (x_{1} + x_{2} + \cdots + x_{n})^{2}$ . 求:

(I) 二次型 $f(x_{1}, x_{2}, \cdots, x_{n}) = x^{T}Ax$ 的秩;

(II) 可逆矩阵 P，使得 $P^{-1}AP = \Lambda$ ，并求二次型的正惯性指数.

(2) 设 $A$ 为 3 阶实对称矩阵，二次型 $f(x_{1}, x_{2}, x_{3}) = x^{T}Ax$ 在正交变换 $x = Qy$ 下的标准形为 $-y_{1}^{2} + 2y_{2}^{2} + ay_{3}^{2}$ ，其中 $Q$ 的第 1 列为 $\left(\frac{1}{\sqrt{3}}, \frac{1}{\sqrt{3}}, \frac{1}{\sqrt{3}}\right)^{T}$ ，且 $|A| = -4$ 。求：

(I)a 的值;

(II) 正交矩阵 Q.

(3) 设二次型 $f(x_1, x_2, x_3) = x^T Ax (A^T = A)$ 经正交变换 $x = Qy$ 化为 $by_2^2 + c^2 y_3^2$ ，其中 $Q = \frac{1}{\sqrt{2}} \begin{pmatrix} 1 & 0 & a \\ 0 & c & 0 \\ b & 0 & 1 \end{pmatrix} (b > 0, c > 0)$ . 求:

(I)a,b,c 的值及矩阵 A;

(II) 可逆矩阵 P, 使得 $A + E = P^{T}P$ .

(4) 设 $A = \begin{pmatrix} a & -\frac{1}{2} & -\frac{1}{2} \\ -\frac{1}{2} & a & -\frac{1}{2} \\ -\frac{1}{2} & -\frac{1}{2} & a \end{pmatrix}$ 与 $B = \begin{pmatrix} b & 0 & 0 \\ 0 & b & 0 \\ 0 & 0 & 0 \end{pmatrix} (b \neq 0)$ 合同.

(I) 求 a 的值;

(II) 若存在正交矩阵 $Q$ , 使得 $Q^T AQ = B$ , 求 $b$ 的值及 $Q$ ;

(III) 对于 (II) 中的 Q, 若 $Q^{T}(A+A^{*})Q=\Lambda$ , 其中 $A^{*}$ 是 A 的伴随矩阵, 求对角矩阵 $\Lambda$ .

(5) 设 3 阶实对称矩阵 A 有二重特征值 1, 且 $(A-4E)\alpha=0$ , 其中 E 是单位矩阵, $\alpha=(1,1,1)^{T}$ .

(I) 求 A;

(II) 记 $X = (x_{1}, x_{2}, x_{3})^{T}$ , 利用正交变换将二次型 $f(x_{1}, x_{2}, x_{3}) = \begin{vmatrix} A & -X \\ X^{T} & 0 \end{vmatrix}$ 化为标准形.

## 概率论与数理统计篇
